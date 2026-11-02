# Publish to the Kastine Augak Blog

This website uses GitHub as its publishing source. Blogger and MediaRecap are not involved.

1. Open the repository and choose Add file → Create new file.
2. Create a file in `posts/` (example: `posts/my-first-article.html`) and write the full article in HTML.
3. Add a matching record to `posts.json` inside the `posts` array.
4. Set `status` to `published` when the article is ready. Commit to the `main` branch.
5. GitHub Pages rebuilds the site; the article appears on the blog and opens as a full article page.

Example record:
```json
{
  "slug": "my-first-article",
  "title": "My First Article",
  "date": "2026-11-02",
  "author": "Kastine Augak",
  "tags": ["Technology", "Uganda"],
  "excerpt": "A concise summary of the article.",
  "status": "draft",
  "content": "<h2>Introduction</h2><p>Write the full article here.</p>"
}
```

Change draft to published when ready. Use unique lowercase slugs. Keep JSON valid and escape quotation marks inside strings. Public display includes only published records. Write original, accurate, properly sourced articles; do not invent reporting, quotes, product tests or research findings.

This first version is a static GitHub-powered publication, not a private in-page editor. It requires no external CMS or API token.