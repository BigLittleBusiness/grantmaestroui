# GrantMaestro Frontend Terraform

This frontend stack is deployed from localhost, not by GitHub Actions. GitHub Actions only builds React assets, syncs S3, and invalidates CloudFront after the infrastructure exists.

## Domain Arrangement

| Purpose | UAT/Staging | Production |
| --- | --- | --- |
| App URL | `https://app.uat.grantmaestro.com` | `https://app.grantmaestro.com` |
| S3 bucket | `uat.grantmaestro.com-frontend` | `prod.grantmaestro.com-frontend` |
| API URL baked into build | `https://api.uat.grantmaestro.com/v1/` | `https://api.grantmaestro.com/v1/` |

Root and `www.grantmaestro.com` are intentionally not managed by this stack, matching the GrantThrive arrangement.

## ACM Flow

Terraform requests a wildcard ACM certificate in `us-east-1` for CloudFront:

- `*.grantmaestro.com`
- `*.uat.grantmaestro.com`
- `grantmaestro.com`

The first apply does not wait for validation and does not attach app aliases because `cloudfront_use_custom_domain = false` by default. When the shared state stack has created the Route53 hosted zone, Terraform creates the ACM validation CNAMEs automatically.

You can still inspect the validation records with:

```bash
terraform output -json frontend_acm_dns_validation_records
```

After ACM status is `ISSUED`, set this in both frontend tfvars and re-apply:

```hcl
cloudfront_use_custom_domain = true
```

You can also set `cloudfront_certificate_arn` to an existing issued us-east-1 certificate ARN. If empty, Terraform uses the requested certificate ARN.

## Local Bootstrap

```bash
cd grantmaestroui
cp terraform/terraform.uat.tfvars.example terraform/terraform.uat.tfvars
cp terraform/terraform.prod.tfvars.example terraform/terraform.prod.tfvars
# Leave route53_zone_id empty; Terraform discovers the managed Route53 zone.
# Leave cloudfront_use_custom_domain=false until the CloudFront ACM cert is issued.
AWS_PROFILE=grantmaestro scripts/infra.sh uat apply
AWS_PROFILE=grantmaestro scripts/infra.sh prod apply
```

After `grantmaestroapi/scripts/infra.sh state apply`, set the printed Route53 name servers at the registrar. Once delegation propagates, ACM validation and app DNS records are managed by Terraform.

## Local Asset Deploy

```bash
cd grantmaestroui
AWS_PROFILE=grantmaestro scripts/deploy.sh uat
AWS_PROFILE=grantmaestro scripts/deploy.sh prod
```

The deploy script builds React, syncs the `build/` folder to S3, finds the CloudFront distribution by alias or S3 origin, and invalidates `/*`.

If Yarn is not installed locally, the deploy script falls back to npm with `--legacy-peer-deps` because this React app currently has older peer dependency ranges in its dependency tree.

## GitHub Actions

`.github/workflows/deploy-aws.yml` does not run Terraform. It only:

1. Installs/builds the React app.
2. Syncs assets to S3.
3. Invalidates CloudFront.
4. Verifies the app URL.
