from __future__ import annotations

import tempfile
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

from scripts.build_sitemap import (
    SITE_BASE_URL,
    SITEMAP_NS,
    discover_urls,
    render_sitemap,
)


class SitemapBuilderTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)

    def tearDown(self) -> None:
        self.temp.cleanup()

    def write_page(self, relative: str, html: str) -> None:
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(html, encoding="utf-8")

    def test_discovers_only_same_site_canonical_pages(self) -> None:
        self.write_page(
            "index.html",
            '<link rel="canonical" href="https://augak.github.io/kastineaugak.github.io/">',
        )
        self.write_page("about.html", '<link rel="canonical" href="about.html">')
        self.write_page(
            "external.html",
            '<link rel="canonical" href="https://example.com/page">',
        )
        self.write_page(
            "other-project.html",
            '<link rel="canonical" href="https://augak.github.io/another-project/">',
        )
        self.write_page("uncanonical.html", '<title>No canonical</title>')

        urls = discover_urls(self.root)
        self.assertEqual(
            urls,
            [
                SITE_BASE_URL,
                SITE_BASE_URL + "about.html",
            ],
        )

    def test_noindex_pages_are_excluded(self) -> None:
        self.write_page(
            "admin/index.html",
            '<meta name="robots" content="noindex,nofollow">'
            '<link rel="canonical" href="admin/">',
        )
        self.write_page(
            "private.html",
            '<meta name="googlebot" content="noindex">'
            '<link rel="canonical" href="private.html">',
        )
        self.assertEqual(discover_urls(self.root), [])

    def test_amp_and_blog_aliases_deduplicate_by_canonical_url(self) -> None:
        canonical = SITE_BASE_URL + "posts/example.html"
        self.write_page("posts/example.html", f'<link rel="canonical" href="{canonical}">')
        self.write_page("amp/example.html", f'<link rel="canonical" href="{canonical}">')
        self.write_page("blog.html", f'<link rel="canonical" href="{SITE_BASE_URL}blog/">')
        self.write_page(
            "blog/index.html",
            f'<link rel="canonical" href="{SITE_BASE_URL}blog/">',
        )

        urls = discover_urls(self.root)
        self.assertEqual(urls, [SITE_BASE_URL + "blog/", canonical])

    def test_noindex_directive_with_spaces_is_excluded(self) -> None:
        self.write_page(
            "hidden.html",
            '<meta name="robots" content="index, noindex, nofollow">'
            '<link rel="canonical" href="hidden.html">',
        )
        self.assertEqual(discover_urls(self.root), [])

    def test_base_url_without_trailing_slash_is_normalized(self) -> None:
        self.write_page("index.html", '<link rel="canonical" href="./">')
        urls = discover_urls(self.root, SITE_BASE_URL.rstrip("/"))
        self.assertEqual(urls, [SITE_BASE_URL])

    def test_multiple_canonical_links_fail_loudly(self) -> None:
        self.write_page(
            "broken.html",
            '<link rel="canonical" href="one.html"><link href="two.html" rel="canonical">',
        )
        with self.assertRaisesRegex(ValueError, "expected at most one canonical"):
            discover_urls(self.root)

    def test_sitemap_is_valid_xml_and_deterministic(self) -> None:
        urls = [SITE_BASE_URL + "about.html", SITE_BASE_URL]
        xml_text = render_sitemap(urls)
        parsed = ET.fromstring(xml_text)
        locations = [
            node.text
            for node in parsed.findall(
                f"{{{SITEMAP_NS}}}url/{{{SITEMAP_NS}}}loc"
            )
        ]
        self.assertEqual(locations, urls)
        self.assertEqual(render_sitemap(urls), xml_text)


if __name__ == "__main__":
    unittest.main()
