# Kastine Augak — publishing platform operations

## Reader submissions and approval
- Contributors submit original writing through `/submit.html`.
- Submissions are private and enter the editorial queue as `pending`.
- Administrators review the article, author details, sources, rights and any cover media.
- Select **Approve** before publishing. Approval alone does not make an article public.
- Once approved, use **Publish approved article** in the admin desk. The server-side `publish-approved-article` function writes the approved article to `posts.json` on the repository's `main` branch and records the published slug and timestamp.
- Only verified, allowlisted administrator accounts may invoke this function.

## One-time publishing secret setup
The Edge Function is deployed, but publishing remains disabled until a GitHub token is configured as a Supabase Edge Function secret.

1. Create a fine-grained GitHub personal access token restricted to `Augak/kastineaugak.github.io`.
2. Grant **Contents: Read and write**. No organization-wide permissions are needed.
3. In Supabase Dashboard, open **Project Settings → Edge Functions → Secrets** (or **Edge Functions → Secrets**).
4. Add a secret named `GITHUB_TOKEN` with the token value. Do not paste it into this repository, this chat, or public JavaScript.
5. Return to the admin desk and try publishing an approved test article.

The function also uses Supabase's server-provided URL and service-role environment variables. Do not expose those values in the website.

## Public discussions
- Comments appear immediately without a GitHub account or Supabase sign-in.
- Administrators can hide and restore comments in the Discussions tab.
- Comments are public. Do not submit private information or sensitive personal details.
- The site records page opens, reactions, downloads, share-button clicks, print-button clicks, discussion opens and comments.

## Newsletter
- The blog signup form records an email address and consent in the private `newsletter_subscribers` table.
- The Newsletter tab is administrator-only and supports status management and CSV export.
- **Email delivery is not connected yet.** Signups are being collected, but no campaign or welcome email is sent. Connect an email delivery provider and configure its API key, sender domain, unsubscribe handling and compliance settings before announcing an active email newsletter.
- Subscriber exports contain personal data and must be stored and shared carefully. Removal requests can be handled by an administrator.

## Administrators
Only these exact verified email addresses are allowlisted:
- `kastineaugak@gmail.com`
- `kastineaugak4@gmail.com`

Each administrator must create an account and verify the email before the database trigger grants the admin claim. Never share passwords or verification codes.

## Social profiles
The website links to Facebook, Instagram, Threads, Pinterest, TikTok, YouTube, Bluesky, X, GitHub and Linktree. Google Business currently opens a Maps search, not a verified direct profile. Add LinkedIn only after confirming its exact public URL.

## Security and privacy
- Public subscribers cannot read the newsletter table; only verified administrators can read or manage it.
- Article submissions, comments, reactions and analytics events use Row Level Security.
- Never put a Supabase service-role key, secret API key or GitHub token in the public repository.
- Review the privacy notice at `/privacy.html` and keep it aligned with any future email provider, analytics or storage integrations.
- Public comments appear immediately, so administrators should moderate spam and abusive content.
