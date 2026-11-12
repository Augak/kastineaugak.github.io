# Search indexing and sitemap maintenance

The project site is published below `https://augak.github.io/` at:

`https://augak.github.io/kastineaugak.github.io/`

## Keep the XML sitemap in sync

The sitemap is generated from each HTML page's canonical link. The generator:

- includes only canonical URLs on this project-site path;
- excludes pages with `noindex` directives;
- ignores HTML without a canonical link (including verification files and templates);
- collapses duplicate canonical URLs, such as AMP pages and the `/blog/` alias;
- writes deterministic XML using only Python's standard library.

After adding or moving an indexable page, run:

```bash
python3 scripts/build_sitemap.py
python3 scripts/build_sitemap.py --check
python3 -m unittest discover -s tests -v
```

Commit the regenerated `sitemap.xml` with the page change. GitHub Actions also runs the sitemap tests and stale-file check on pushes and pull requests.

## Submit the sitemap

In Google Search Console, use the exact project-site sitemap URL:

`https://augak.github.io/kastineaugak.github.io/sitemap.xml`

A successful repository check proves that the XML is well-formed and matches the current canonical tags. It does **not** prove that Google's crawler can fetch the deployed URL or that Google has indexed the listed pages. After deployment, check the sitemap status and URL inspection reports in Search Console.

## GitHub Pages project-site robots limitation

A `robots.txt` stored in this repository is served below the project path, not at the host root. Search crawlers look for host-wide robots rules at `https://augak.github.io/robots.txt`. The project-site `robots.txt` should therefore not be treated as a host-root crawler policy. A host-root file requires the account's root Pages site/repository; do not create a second repository just to pretend this project-path file controls the whole host.

This does not prevent manually submitting the project-site sitemap URL in Search Console.
