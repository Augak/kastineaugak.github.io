# kastineaugak.github.io

Personal portfolio and technical publishing site for Kastine Augak (Kamulindwa Augustine), focused on technology, innovation, software, AI, and digital media from Uganda.

## Live site

- GitHub Pages: https://augak.github.io/kastineaugak.github.io/
- Main pages: `index.html`, `about.html`, `ventures.html`, `blog.html`, `contact.html`

## Local preview

This is a static site. From the repository root, use any static server, for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

## Publishing articles

Articles are stored in the `posts/` directory and surfaced through the blog feed. Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting or adding a contribution.

## Accessibility and privacy

The site uses semantic landmarks, a skip link, visible keyboard focus, reduced-motion support, and mobile-friendly layouts. No forced login or analytics dependency is required for the static pages.

## Deployment

Push changes to `main` and enable GitHub Pages from repository settings using the root of the branch. No build step is required.

## Automated site quality checks

GitHub Actions runs checks on pull requests and pushes to `main`, with a scheduled audit every Monday. All test dependencies are installed temporarily on GitHub-hosted runners; they are not added to the website or shipped to visitors.

- **Lighthouse CI:** audits the homepage, About, Ventures, and Contact pages with three runs per page. Accessibility and SEO have minimum score gates; performance and best-practices scores are warnings initially.
- **axe-core + Playwright:** scans those key pages for WCAG 2.1 A/AA and WCAG 2.0 A/AA accessibility issues. It uploads a JSON report as a workflow artifact. This is initially report-only.
- **HTML validation:** checks HTML markup. It is initially report-only so existing markup can be improved gradually.
- **Lychee:** checks local and external links in HTML, Markdown, XML, and text files. It is initially report-only because third-party websites can rate-limit automated checks.
- **Prettier:** checks formatting without changing files. It is initially report-only to avoid a large automatic reformat of existing pages.
- **Gitleaks:** scans repository history for accidentally committed secrets.
- **Dependabot:** checks GitHub Actions references weekly and opens update pull requests.

Run Lighthouse locally with Node.js and npm installed:

```bash
npm install --no-save --no-audit --no-fund @lhci/cli@0.14.0
python3 -m http.server 4173
```

In a second terminal, run `npx lhci autorun --config=./lighthouserc.json`.

### Image optimization with Squoosh

Use [Squoosh](https://squoosh.app/) manually when adding or replacing large images. Keep the original source image, compare the optimized result at mobile size, and update references only after checking the result. Prefer appropriately sized WebP/AVIF images with a compatible fallback where needed. No bulk conversion or destructive image rewrite runs automatically.

### Real-device performance with WebPageTest

Use [WebPageTest](https://www.webpagetest.org/) for occasional real-browser, network-throttled tests after meaningful design or image changes. The public service may require an account/API key for automation. Do not put API keys in source files; if automated testing is added later, store credentials only as GitHub Actions secrets. Lighthouse CI remains the automatic baseline and does not depend on WebPageTest.

### Why no front-end packages?

This is a lightweight static GitHub Pages site. The quality tools run only in CI or in a browser-based optimization workflow. They do not add React, Bootstrap, a bundler, analytics, or extra JavaScript to the visitor experience.

## Sitemap integrity

The XML sitemap is generated from page canonical links so newly published pages do not silently remain undiscoverable. Pages marked `noindex`, non-canonical aliases, AMP duplicates, templates and verification files are excluded.

From the repository root:

```bash
python3 scripts/build_sitemap.py
python3 scripts/build_sitemap.py --check
python3 -m unittest discover -s tests -v
```

The GitHub Actions site-quality workflow runs the unit tests and checks that the committed `sitemap.xml` matches the current canonical pages. See [docs/SEO_INDEXING.md](docs/SEO_INDEXING.md) for Google Search Console submission guidance and the GitHub Pages project-site `robots.txt` limitation.
