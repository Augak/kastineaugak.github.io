# Article submissions, public discussions and publishing

## Reader submissions
Readers and contributors can submit original articles using `/submit.html`. Submissions are stored privately in Supabase with status `pending`; they are not published automatically.

## Private administrator desk
Open `/admin/` on the same website. Only these two exact email addresses can receive administrator privileges:
- `kastineaugak@gmail.com`
- `kastineaugak4@gmail.com`

The admin login page includes an account-creation flow for these addresses. Each account must verify its email before the database trigger assigns its administrator claim. Use a strong, unique password. The database policies—not the client-side form—enforce access.

## Review workflow
1. A contributor submits title, name, contact email, summary, topics, article text and source URLs.
2. An administrator reviews the submission in the Submissions tab.
3. Approve or reject and optionally leave an editorial note.
4. Approval is an editorial decision, not automatic public publishing. Complete fact-checking, formatting, source and rights checks, then add the approved article to `posts.json`.
5. Published article records may include `coverImage`, `coverAlt`, `coverVideo`, and `mediaCredit`. Use media you own or have permission to publish.

## Public article engagement
- Visitors can post comments without GitHub or Supabase accounts.
- Public comments appear immediately and can be hidden/restored by an administrator in the Discussions tab.
- Visitors can react once per article per browser storage key.
- The site records article page opens, reactions, downloads, shares, print actions, discussion opens and comment submissions.
- The Analytics tab shows 7-, 30-, 90-, 365-day and all-time summaries. These are site engagement metrics, not external social-platform reach or impressions.

## Social profiles
The site links to the profiles verified from the connected publishing brand: Facebook, Instagram, Threads, Pinterest, TikTok, YouTube, Bluesky, X, GitHub and Linktree. Google Business opens a Google Maps search for the brand. Add a confirmed LinkedIn profile URL when available.

## Security notes
- Submissions, reactions, events and comments use Row Level Security.
- Only verified, allowlisted administrator accounts can read submissions, review analytics or moderate comments.
- Never put a Supabase service-role key or GitHub token in this repository.
- Public comments are intentionally visible to everyone. Administrators should moderate spam and abusive content.
- The dashboard records approvals but does not yet push approved articles into GitHub automatically. That final publishing integration requires a protected server-side GitHub App/token secret and publishing function.
