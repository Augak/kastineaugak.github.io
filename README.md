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

GitHub Actions runs Lighthouse CI on pull requests and pushes to `main`, with a scheduled audit every Monday. The audit checks the homepage, About, Ventures, and Contact pages using three Lighthouse runs per page.

- Accessibility and SEO have minimum score gates; performance and best-practices scores are tracked as warnings initially so existing pages can be improved without blocking every contribution.
- Lighthouse reports are uploaded to Lighthouse CI's temporary public report storage. Avoid putting private or unpublished content on the audited site.
- Run the same audit locally with Node.js and npm installed:

  ```bash
  npm install --no-save --no-audit --no-fund @lhci/cli@0.14.0
  python3 -m http.server 4173
  ```

  In a second terminal, run `npx lhci autorun --config=./lighthouserc.json`.

The site remains a static GitHub Pages project; Lighthouse runs in CI and adds no JavaScript or download cost for visitors.


### Additional maintenance and security checks

- **HTML validation:** runs on every PR and push. It is initially report-only so legacy markup can be cleaned up progressively without blocking publishing.
- **Secret scanning:** Gitleaks checks repository history for accidentally committed API keys, tokens, and credentials.
- **Dependabot:** checks GitHub Actions references weekly and opens update PRs. This repository does not need a front-end package manager or visitor-side framework just to run these checks.
