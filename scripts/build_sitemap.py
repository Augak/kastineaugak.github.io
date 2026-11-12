#!/usr/bin/env python3
"""Build and validate the canonical XML sitemap for the GitHub Pages site.

Only HTML pages with one canonical URL on this site are eligible. Pages marked
noindex are excluded, and canonical duplicates (including AMP aliases) collapse
into one URL. No network access or third-party packages are required.
"""

from __future__ import annotations

import argparse
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit

SITE_BASE_URL = "https://augak.github.io/kastineaugak.github.io/"
SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
SKIP_DIRS = {".git", ".github", "node_modules", ".venv", "venv"}


class PageMetadataParser(HTMLParser):
    """Extract canonical links and robots directives without parsing page JS."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.canonicals: list[str] = []
        self.robots_directives: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key.lower(): value for key, value in attrs}
        if tag.lower() == "link":
            rel = (values.get("rel") or "").lower().split()
            href = values.get("href")
            if "canonical" in rel and href:
                self.canonicals.append(href.strip())
        elif tag.lower() == "meta":
            name = (values.get("name") or "").lower()
            content = (values.get("content") or "").lower()
            if name in {"robots", "googlebot"} and content:
                self.robots_directives.append(content)


def is_indexable_site_url(candidate: str, base_url: str) -> bool:
    """Return true only for clean HTTPS URLs inside this project-site prefix."""
    resolved = urljoin(base_url, candidate)
    parsed = urlsplit(resolved)
    base = urlsplit(base_url)
    if parsed.scheme != "https" or parsed.netloc.lower() != base.netloc.lower():
        return False
    if parsed.query or parsed.fragment:
        return False
    base_path = base.path if base.path.endswith("/") else base.path + "/"
    return parsed.path.startswith(base_path)


def canonical_for_file(path: Path, base_url: str) -> str | None:
    parser = PageMetadataParser()
    parser.feed(path.read_text(encoding="utf-8"))
    parser.close()

    if any(
        "noindex" in {part.strip() for part in directive.split(",")}
        for directive in parser.robots_directives
    ):
        return None
    if len(parser.canonicals) != 1:
        if len(parser.canonicals) > 1:
            raise ValueError(
                f"{path}: expected at most one canonical link, found {len(parser.canonicals)}"
            )
        return None

    candidate = urljoin(base_url, parser.canonicals[0])
    if not is_indexable_site_url(candidate, base_url):
        return None
    return candidate


def discover_urls(root: Path, base_url: str = SITE_BASE_URL) -> list[str]:
    """Find unique canonical URLs from all eligible HTML files below root."""
    base_url = base_url.rstrip("/") + "/"
    found: set[str] = set()
    for path in sorted(root.rglob("*.html")):
        relative_parts = path.relative_to(root).parts
        if any(part in SKIP_DIRS for part in relative_parts):
            continue
        canonical = canonical_for_file(path, base_url)
        if canonical:
            found.add(canonical)

    base_home = base_url.rstrip("/") + "/"
    return sorted(found, key=lambda url: (url != base_home, url))


def render_sitemap(urls: list[str]) -> str:
    ET.register_namespace("", SITEMAP_NS)
    root = ET.Element(f"{{{SITEMAP_NS}}}urlset")
    for location in urls:
        url_node = ET.SubElement(root, f"{{{SITEMAP_NS}}}url")
        ET.SubElement(url_node, f"{{{SITEMAP_NS}}}loc").text = location
    ET.indent(root, space="  ")
    body = ET.tostring(root, encoding="unicode", xml_declaration=True)
    return body + "\n"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--output", type=Path, default=None)
    parser.add_argument("--base-url", default=SITE_BASE_URL)
    parser.add_argument(
        "--check", action="store_true", help="fail if the committed sitemap is stale"
    )
    args = parser.parse_args(argv)

    root = args.root.resolve()
    output = (args.output or root / "sitemap.xml").resolve()
    if not root.is_dir():
        parser.error(f"site root does not exist: {root}")

    try:
        urls = discover_urls(root, args.base_url)
    except (OSError, UnicodeError, ValueError) as exc:
        print(f"Sitemap generation failed: {exc}", file=sys.stderr)
        return 2

    if not urls:
        print("Sitemap generation found no eligible canonical pages.", file=sys.stderr)
        return 2

    expected = render_sitemap(urls)
    if args.check:
        try:
            current = output.read_text(encoding="utf-8")
        except OSError:
            current = ""
        if current != expected:
            display_path = output.relative_to(root) if output.is_relative_to(root) else output
            print(
                f"{display_path} is stale. Run: python3 scripts/build_sitemap.py",
                file=sys.stderr,
            )
            return 1
        print(f"Sitemap is current: {len(urls)} canonical URLs.")
        return 0

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(expected, encoding="utf-8")
    print(f"Wrote {output}: {len(urls)} canonical URLs.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
