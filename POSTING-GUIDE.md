# Publish to the Kastine Augak Blog

The publication is hosted on GitHub Pages. Blogger and MediaRecap are not involved.

## Editorial workflow

1. Contributors fork the repository and add an article in `posts/` using `posts/article-template.html`.
2. They submit a pull request to `main`; the PR checklist asks for author information, sources, rights and disclosures.
3. The editor verifies the claims, references, author background where relevant, and copyright permissions.
4. Only after approval does the editor add a `published` record to `posts.json`. Drafts are not shown publicly.
5. For article-specific comments and reactions, create a GitHub feedback issue for the article and add its URL as `discussionUrl` in the post record. Readers can comment and use GitHub reactions on that issue.

## Example post record

```json
{
  "slug": "sample-article",
  "title": "Sample Article Title",
  "date": "2026-11-02",
  "author": "Contributor Name",
  "authorCredentials": "A short, checked description of relevant experience.",
  "authorProfile": "https://example.org/author-profile",
  "tags": ["Technology", "Uganda"],
  "excerpt": "A concise summary of the article.",
  "status": "draft",
  "content": "<h2>Introduction</h2><p>Full article HTML.</p>",
  "sources": [
    {
      "title": "Source title",
      "publisher": "Publisher or institution",
      "url": "https://example.org/source",
      "accessed": "2026-11-02"
    }
  ],
  "rightsHolder": "Contributor Name",
  "license": "All rights reserved",
  "discussionUrl": "https://github.com/Augak/kastineaugak.github.io/issues/REPLACE_WITH_ISSUE_NUMBER"
}
```

Use real source URLs and exact rights information. Do not invent an author credential, verification, source, copyright claim, research result, interview, test, or quotation. A source link supports the specific claims it contains; it does not automatically verify the author's identity or qualifications. The contributor remains the copyright owner unless a valid agreement says otherwise.

## Reader tools

Each published article supports HTML and plain-text downloads, browser print / Save as PDF, native share where supported, and GitHub discussion links. The discussion URL is optional until an editor creates the article's feedback issue.

This is a static GitHub-powered site. It does not currently provide a private in-page contributor dashboard or automatic AI publishing.
