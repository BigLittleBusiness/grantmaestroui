# GrantMaestro public UX remediation release

**Release date:** 6 October 2026
**Scope:** remediation items from the 6 October 2026 public UX audit and the supplied implementation brief.

## Completed in this release

### Public navigation, accessibility and mobile use

- Replaced JavaScript-only marketing navigation with ordinary, keyboard-operable links.
- Added a skip-to-content link and a `main` landmark across public pages.
- Added visible high-contrast keyboard focus states and 44px minimum targets for key mobile controls.
- Repaired feature-section heading hierarchy.
- Reduced the public header to concise, outcome-led navigation; the full product audience remains represented on dedicated landing pages.

### Registration, sign-in and recovery

- Added form-level error summaries, focus on the first invalid field, required-field semantics and linked inline errors.
- Added show/hide password controls and clear password guidance to sign-up, reset and invited-user forced-reset paths.
- Made billing choices readable, keyboard-operable radio controls; annual billing is consistently framed as **two months free**.
- Added explicit Terms of Service and Privacy Policy links at account creation.
- Added clear reset-link failure and post-request guidance without disclosing whether an account exists.

### Readiness Snapshot and contact paths

- Added answer-level accessibility feedback to the snapshot questionnaire.
- Prevented endless “preparing” UI after the external refinement polling window closes.
- When email delivery/CAPTCHA configuration is unavailable, removed the contact-capture form rather than collecting data that cannot be delivered. Visitors can still download their on-screen priorities.
- Updated the public contact form with browser-native required validation and an explicit non-capture unavailable state.
- Disabled in-app support submission when CAPTCHA configuration is unavailable.
- Removed the public Zoho chat embed so the website follows the form-only contact requirement.
- Confirmed public source has no `mailto:` links or raw support recipient address.

### Trust, support, billing and payment safety

- Replaced unsupported public “Australian Hosted” and generic security badges with policy-backed wording.
- Expanded the Privacy Policy to describe data categories, purposes, providers, potential international processing, AI minimisation, retention/deletion principles and the privacy-enquiry process.
- Expanded the Terms of Service with trial, billing, renewal, cancellation, payment-provider, export and post-cancellation information.
- Added a public Support Centre with request severity guidance, response target, time-zone context and first-week onboarding pointers.
- Removed hard-coded support response promises from plan cards.
- Removed the unsafe legacy payment-method screen that simulated collection of card number/CVC/expiry data.
- Disabled manual PIN token entry until a real PIN hosted/tokenised checkout is implemented. Stripe hosted checkout remains the approved route when configured and activated.

### Performance

- Lazy-loaded public, authentication and protected route modules to reduce initial JavaScript.
- Deferred below-fold marketing imagery using native lazy loading.
- Added production Nginx caching/compression configuration and a short deployment verification guide.

## Production prerequisites before public deployment

1. Configure Cloudflare Turnstile for the exact production hostnames and set `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_EXPECTED_HOSTNAMES` and the encoded contact recipient in the protected API environment. See the API repository’s `docs/contact-form-configuration.md`.
2. Apply and verify the committed Nginx configuration in `docs/deployment/nginx-static-performance.conf`; do not disturb HTTPS or the existing API proxy.
3. Have qualified legal/privacy and commercial leadership review and approve the revised public policies before relying on them as final legal terms.
4. Leave PIN disabled unless a real, provider-approved hosted/tokenised payment integration has been implemented and tested. Do not reintroduce a card number, CVC or manual payment-token field.
5. Test the deployed site on current mobile Safari, Chrome and an assistive-technology/keyboarding pass after production deployment.

## Deliberately deferred / requires separate authority

- Exact provider list, data-residency details, subprocessor locations and retention durations require verified infrastructure/vendor contracts and legal sign-off.
- A formal accessibility conformance audit (WCAG 2.2 AA) requires specialist manual and assistive-technology testing.
- Full customer lifecycle testing for billing, renewal, cancellation and refunds requires a configured payment provider and test-mode credentials.
- A true public status page requires an operational monitoring/status provider and incident-owner process.
