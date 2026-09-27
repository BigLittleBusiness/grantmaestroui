# GrantMaestro — Grant Portfolio Risk & Readiness Snapshot

## Permanent marketing implementation

The live GrantMaestro marketing experience is implemented as a public React route:

- **Route:** `/grant-portfolio-readiness`
- **Page source:** `src/pages/PortfolioReadinessPage.jsx`
- **Page styling:** `src/pages/PortfolioReadinessPage.css`
- **Homepage promotion:** `src/components/LandingPage/MainContent.jsx`
- **Persistent discovery:** Marketing header, footer and `public/sitemap.xml`

It is a practical, nine-question diagnostic for council and public-purpose grant teams. It returns on-screen priorities for:

1. deadline and opportunity visibility;
2. acquittal and evidence readiness; and
3. accountable ownership and continuity.

The experience deliberately does **not** ask for grant, funder, financial or document data. It is not presented as an audit, compliance assessment, certification, benchmark or savings calculator.

## Action-plan email capture

The page calls the protected API route `POST /v1/public/portfolio-readiness` only after:

- explicit marketing consent;
- Cloudflare Turnstile completion in the browser;
- server-side Turnstile verification;
- public-form rate limiting; and
- confirmation that protected SES and contact-recipient configuration is active.

When those settings are unavailable, the page remains useful: visitors receive the on-screen priorities, while the email capture is deliberately unavailable rather than silently collecting their details or making an undeliverable promise.

The implementation sends an immediate action-plan email and an internal lead alert. The five-email nurture sequence in `Email_Follow_Up_Sequence.md` is approved copy and must be connected to a consent-aware CRM or transactional-email workflow before Emails 2–5 are automated. Each non-essential follow-up needs a working unsubscribe mechanism.

## Campaign collateral

| File | Purpose |
|---|---|
| `Email_Follow_Up_Sequence.md` | Brand-aligned five-email consent-based sequence |
| `LinkedIn_Promotion_Copy.md` | Company, founder, partner and participant LinkedIn copy |
| `share-card-template.html` | Editable LinkedIn share-card source |
| `share-card.css` / `share-card.js` | Supporting share-card styling and controls |

Canonical logo treatments and palette source files are held in `src/assets/brand/`. The share-card template references the approved white wordmark with explicit display dimensions so the original high-resolution source cannot create an oversized layout when the template is opened locally.
