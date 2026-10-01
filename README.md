# Grant Maestro UI

The frontend React application for Grant Maestro.

## Prerequisites

- Node.js 22.x
- Yarn package manager, or npm with legacy peer dependency support

## Local Development Setup

1. **Install dependencies**
   ```bash
   yarn install
   # or, without Yarn:
   npm install --legacy-peer-deps
   ```

2. **Configure the API URL**
   ```bash
   cp .env.example .env
   ```
   `REACT_APP_API_URL` must point at the running backend, e.g. `http://localhost:3001/v1/` (the backend runs on 3001 locally). Set up the backend first; see its README.

3. **Start the development server**
   ```bash
   yarn start   # or: npm start
   ```
   The app is served at `http://localhost:3000`.

## Scripts

| Script | Purpose |
| --- | --- |
| `start` | Development server with hot reload |
| `build` | Production build in `build/` |
| `test` | Jest tests (`react-scripts test`) |
| `test:pricing-display` | Smoke test: pricing never renders an incomplete live price as $0 |
| `test:readiness-interpretation` | Smoke test for the portfolio readiness display |

## Tech Stack

- **Framework:** React 19 (Create React App)
- **State Management:** Redux Toolkit
- **Routing:** React Router 7
- **Styling:** Bootstrap 5 + custom CSS
- **HTTP Client:** Axios (cookies are sent with every request)

## Notes

- **Sessions:** the logged-in user is not persisted in the browser. After a refresh, the layouts reload it from `GET /v1/auth/profile-view` and show a loader until the role is known.
- **Page access:** role access for pages is defined in `src/utils/roleAccess.js` and mirrors the backend's `routeAccessHelper.js`. Platform Admin pages live under `/admin/*`.
- **Layouts:** `AuthenticatedLayout` wraps every signed-in page; `AdminAuthenticatedLayout` is the same layout with per-page role checks.
- **Trial:** during the free trial, a banner shows the days left. Organisation Admins also get a "Subscribe now" link.
- **Expired subscriptions:** an Organisation Admin can only reach the `/payment/*` pages. Any other page, or API call answered `402 SUBSCRIPTION_EXPIRED`, redirects to checkout (`src/api/index.js`, `subscriptionRedirectFor` in `src/utils/roleAccess.js`). Other users are signed out.
- **Subscription page:** `/subscription` (sidebar → Subscription) shows Organisation Admins their plan, status, seats, next payment, card and invoices. They can change plan, billing interval and extra seats (with a price preview), and open Stripe's portal via "Manage billing". Checkout redirects existing subscribers there.
- **Payments:** subscriptions are paid through Stripe hosted Checkout:
  - `/payment/checkout` shows the plan, extra seats, and the GST estimate for Australian addresses;
  - Stripe returns customers to `/payment/success` or `/payment/cancel`.

## AWS Deployment

GrantMaestro UI is deployed in the same localhost-first style as GrantThrive:

- Terraform is applied manually from a local machine using the `grantmaestro` AWS profile.
- GitHub Actions does not manage Terraform.
- GitHub Actions only builds React assets, syncs S3, invalidates CloudFront, and verifies the app URL after infrastructure exists.
- UAT uses `https://app.uat.grantmaestro.com`.
- Production uses `https://app.grantmaestro.com`.
- Route53 manages DNS for `grantmaestro.com`.
- CloudFront serves the static React app from S3.

### Frontend Infrastructure

```bash
AWS_PROFILE=grantmaestro scripts/infra.sh uat plan
AWS_PROFILE=grantmaestro scripts/infra.sh uat apply

AWS_PROFILE=grantmaestro scripts/infra.sh prod plan
AWS_PROFILE=grantmaestro scripts/infra.sh prod apply
```

Terraform files for each environment live in:

- `terraform/terraform.uat.tfvars`
- `terraform/terraform.prod.tfvars`

The frontend stack manages S3 static hosting, CloudFront, us-east-1 ACM validation for CloudFront, and Route53 app DNS records.

### Frontend Deploy

```bash
AWS_PROFILE=grantmaestro scripts/deploy.sh uat
AWS_PROFILE=grantmaestro scripts/deploy.sh prod
```

The deploy script builds React, syncs `build/` to S3, discovers the matching CloudFront distribution, and invalidates `/*`.

If Yarn is not installed, the deploy script falls back to npm with `--legacy-peer-deps`.

### API URLs

The deployed builds use:

- UAT: `https://api.uat.grantmaestro.com/v1/`
- Production: `https://api.grantmaestro.com/v1/`
