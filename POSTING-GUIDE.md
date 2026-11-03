# Article submission and publishing

Readers and contributors can submit original articles using the form at `/submit.html`. Submissions are stored privately in Supabase with the status `pending`; they are not published automatically.

## Editorial workflow
1. A contributor submits title, name, contact email, summary, topics, article text and source URLs.
2. An allowlisted administrator signs in at `/admin/` and reviews the submission.
3. The administrator approves or rejects it and may leave an editorial note.
4. An approved article still requires final fact-checking, formatting, rights review and inclusion in `posts.json` before it appears publicly on the blog.
5. Published articles can optionally include `coverImage`, `coverAlt`, `coverVideo`, and `mediaCredit` fields in their `posts.json` record. Use media you own or have permission to publish.

## Administrator access
The two authorized addresses are:
- `kastineaugak@gmail.com`
- `kastineaugak4@gmail.com`

Create/invite these users under Supabase Authentication > Users. The database trigger assigns the admin claim only to these exact addresses. Public visitors cannot read or alter submissions. Never place a Supabase service-role key or GitHub token in this repository.

## Important publication boundary
The dashboard records editorial decisions in Supabase. It does not yet push approved articles into GitHub automatically; that final publishing integration requires a server-side GitHub App/token secret and a protected publishing function.