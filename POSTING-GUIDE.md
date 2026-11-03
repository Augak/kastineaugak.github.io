# Publishing Desk — quick reference

This note is for the publication team. Contributors and readers should use the public Contributor Hub instead: https://augak.github.io/kastineaugak.github.io/contributors.html

## Editorial queue
1. Open the private desk at https://augak.github.io/kastineaugak.github.io/admin/.
2. Review the article, author details, summary, source links and any media.
3. Approve and publish only after the article is ready. Approval calls the secure `publish-approved-article` Edge Function.
4. If publishing is blocked, check the function logs and the `GITHUB_TOKEN` Edge Function secret. The token must be limited to the `Augak/kastineaugak.github.io` repository with Contents read/write access.
5. Confirm the article appears on the public blog and that its published slug and timestamp are recorded.

## Reader activity
- Public comments appear immediately and can be hidden or restored in the Discussions tab.
- Article reactions and comment reactions are stored in Supabase and counted from database records.
- The analytics tab reports recorded blog activity; it does not claim to measure external social-network reach.
- Moderate spam, abuse and requests to remove personal information promptly.

## Newsletter workflow
1. Draft an edition in the Newsletter tab.
2. Publish it to the public archive. This step does not send email.
3. Check the email status indicator before sending.
4. Send only to active subscribers with recorded consent. Successful recipient deliveries are not repeated on retry.
5. Review sent/failed/skipped counts and the delivery records.

The email function uses Brevo and the following Edge Function secrets:
- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL` (the function also accepts the legacy spelling `BREVO_SENDERS_EMAIL`)
- `BREVO_SENDER_NAME`
- `NEWSLETTER_UNSUBSCRIBE_SECRET` (use a long random value)

The current function enforces a 300-email rolling 24-hour safety limit. Keep API keys and signing secrets in Supabase Edge Function secrets, never in GitHub files or browser code. Verify the sender address in Brevo before sending a real campaign.

## Admin access and privacy
Only the two allowlisted administrator addresses can use the private desk:
- `kastineaugak@gmail.com`
- `kastineaugak4@gmail.com`

Admin accounts must be verified and receive the server-managed admin claim. Never share passwords, verification codes, API keys or access tokens. Subscriber exports contain personal data and must be handled carefully.

## Useful public pages
- Articles: https://augak.github.io/kastineaugak.github.io/blog.html
- Contributor Hub: https://augak.github.io/kastineaugak.github.io/contributors.html
- Article submission: https://augak.github.io/kastineaugak.github.io/submit.html
- Newsletter archive: https://augak.github.io/kastineaugak.github.io/newsletter-archive.html
- Privacy notice: https://augak.github.io/kastineaugak.github.io/privacy.html