# Design and interaction quality standard

This repository is a public-facing personal portfolio and publishing site. Design work must improve clarity, trust, accessibility and usability—not add decoration for its own sake.

## Design references and working methods

Apply these principles during every meaningful UI change:

1. **Apple-inspired interface craft**
   - Use clear hierarchy, deliberate spacing, restrained typography and consistent alignment.
   - Prefer native-feeling controls, predictable navigation and focused page layouts.
   - Keep content readable at narrow mobile widths and on older Android devices.
   - Respect reduced-motion preferences, keyboard navigation, visible focus and screen-reader semantics.
   - Do not copy Apple's branding, proprietary assets or exact interface designs.

2. **Emil Kowalski–informed motion**
   - Motion should explain state changes, hierarchy or spatial relationships.
   - Prefer short, purposeful transitions with natural easing; avoid gratuitous parallax, bouncing and scroll-jacking.
   - Keep interactions responsive and lightweight. Disable or reduce non-essential motion when `prefers-reduced-motion: reduce` is set.
   - Do not make essential content or controls depend on animation.

3. **Impeccable design review**
   - Before implementation, identify the user, task, content priority and primary action.
   - Review visual hierarchy, typography, spacing, contrast, consistency, responsive behavior, empty/error/loading states and content density.
   - Remove generic AI-looking decoration, unnecessary pills, excessive gradients, fake controls and ornamental elements that do not help users.
   - Preserve the site's established identity and real content; do not invent testimonials, metrics, roles or claims.

4. **Playwright verification**
   - Use Playwright for real browser checks when UI, navigation, forms, responsive behavior or interactive state changes.
   - Cover a narrow mobile viewport (390×844) and a desktop viewport; add tablet coverage when the layout materially changes there.
   - Verify primary navigation, keyboard operation, focus visibility, form validation/submission states, console errors and horizontal overflow.
   - Use axe-core for automated accessibility checks, then manually inspect meaningful issues; automated scans do not prove full accessibility.
   - Add stable end-to-end or visual regression tests for important flows when the value outweighs maintenance cost. Avoid brittle pixel snapshots for dynamic content.
   - Capture screenshots for review when the design changes. Never treat a successful page load alone as a complete UX test.

## Implementation guardrails

- Keep the site lightweight, mobile-first, accessible and usable on low-bandwidth connections.
- Prefer semantic HTML, progressive enhancement and existing project conventions over introducing a large framework.
- Preserve existing publishing, newsletter, engagement and navigation behavior unless a change is explicitly required.
- Every visible control must perform its stated action; remove or disable controls that are not implemented.
- Test loading, empty, success and failure states for any changed interactive flow.
- Do not add a design/testing dependency solely for documentation. Use connected design skills or Playwright MCP when available; otherwise use the repository's existing Playwright and axe-core CI setup.
- Record any known limitation in the pull request instead of claiming a test was run when it was not.

## Definition of done for UI changes

- [ ] Design intent and primary user task are clear.
- [ ] Mobile, desktop and keyboard behavior are reviewed.
- [ ] Reduced-motion and screen-reader behavior are considered.
- [ ] Changed interactions are verified in Playwright where practical.
- [ ] axe-core findings are reviewed and meaningful regressions fixed.
- [ ] No fake controls, console errors or unintended horizontal overflow remain.
- [ ] Existing site content and publishing behavior are preserved.
