# Grant Maestro UI

The frontend React application for Grant Maestro.

## Prerequisites

- Node.js 22.x
- Yarn package manager, or npm with legacy peer dependency support

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/BigLittleBusiness/grantmaestroui.git
   cd grantmaestroui
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment Configuration**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure `REACT_APP_API_URL` points to your running local API instance.*

4. **Start the development server**
   ```bash
   yarn start
   ```
   The application will be available at `http://localhost:3000`.

## Tech Stack

- **Framework:** React 19
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM v6
- **Styling:** Bootstrap 5 + custom CSS
- **HTTP Client:** Axios

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
