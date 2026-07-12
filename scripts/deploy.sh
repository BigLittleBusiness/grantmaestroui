#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

usage() {
  cat <<USAGE
Usage:
  scripts/deploy.sh <prod|uat|staging> [--skip-build] [--region <aws_region>]

Examples:
  AWS_PROFILE=grantmaestro scripts/deploy.sh uat
  AWS_PROFILE=grantmaestro scripts/deploy.sh prod
  scripts/deploy.sh staging
USAGE
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

TARGET_ENV="$1"
shift

SKIP_BUILD="false"
AWS_REGION=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-build)
      SKIP_BUILD="true"
      shift
      ;;
    --region)
      AWS_REGION="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

case "$TARGET_ENV" in
  prod)
    S3_BUCKET_NAME="${FRONTEND_BUCKET_NAME:-prod.grantmaestro.com-frontend}"
    CLOUDFRONT_ALIAS="${CLOUDFRONT_ALIAS:-app.grantmaestro.com}"
    API_URL="https://api.grantmaestro.com/v1/"
    ;;
  uat)
    S3_BUCKET_NAME="${FRONTEND_BUCKET_NAME:-uat.grantmaestro.com-frontend}"
    CLOUDFRONT_ALIAS="${CLOUDFRONT_ALIAS:-app.uat.grantmaestro.com}"
    API_URL="https://api.uat.grantmaestro.com/v1/"
    ;;
  staging)
    S3_BUCKET_NAME="${FRONTEND_BUCKET_NAME:-uat.grantmaestro.com-frontend}"
    CLOUDFRONT_ALIAS="${CLOUDFRONT_ALIAS:-app.uat.grantmaestro.com}"
    API_URL="https://api.uat.grantmaestro.com/v1/"
    TARGET_ENV="uat"
    ;;
  *)
    echo "Environment must be 'prod', 'uat', or 'staging'." >&2
    usage
    exit 1
    ;;
esac

cd "$ROOT_DIR"

for cmd in aws; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "$cmd is required for frontend deployment." >&2
    exit 1
  fi
done

AWS_ARGS=()
if [[ -n "$AWS_REGION" ]]; then
  AWS_ARGS+=(--region "$AWS_REGION")
fi

run_aws() {
  if [[ ${#AWS_ARGS[@]} -gt 0 ]]; then
    aws "${AWS_ARGS[@]}" "$@"
  else
    aws "$@"
  fi
}

if [[ "$SKIP_BUILD" != "true" ]]; then
  if [[ ! -d node_modules ]]; then
    if command -v yarn >/dev/null 2>&1; then
      yarn install --frozen-lockfile
    else
      npm install --no-package-lock --legacy-peer-deps
    fi
  fi

  if command -v yarn >/dev/null 2>&1; then
    CI=false REACT_APP_API_URL="$API_URL" yarn build
  else
    CI=false REACT_APP_API_URL="$API_URL" npm run build
  fi
fi

CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:-}"
if [[ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]]; then
  CLOUDFRONT_DISTRIBUTION_ID="$(aws cloudfront list-distributions \
    --query "DistributionList.Items[?Aliases.Items && contains(Aliases.Items, '${CLOUDFRONT_ALIAS}')].Id | [0]" \
    --output text)"
fi

if [[ -z "$CLOUDFRONT_DISTRIBUTION_ID" || "$CLOUDFRONT_DISTRIBUTION_ID" == "None" ]]; then
  ORIGIN_DOMAIN="${S3_BUCKET_NAME}.s3.ap-southeast-2.amazonaws.com"
  CLOUDFRONT_DISTRIBUTION_ID="$(aws cloudfront list-distributions \
    --query "DistributionList.Items[?Origins.Items[?DomainName=='${ORIGIN_DOMAIN}']].Id | [0]" \
    --output text)"
fi

if [[ -z "$CLOUDFRONT_DISTRIBUTION_ID" || "$CLOUDFRONT_DISTRIBUTION_ID" == "None" ]]; then
  echo "Could not find CloudFront distribution for alias ${CLOUDFRONT_ALIAS}." >&2
  echo "Set CLOUDFRONT_DISTRIBUTION_ID explicitly or apply frontend Terraform first." >&2
  exit 1
fi

aws s3 sync ./build "s3://${S3_BUCKET_NAME}" --delete
aws cloudfront create-invalidation \
  --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" \
  --paths "/*"

echo "Frontend deployment completed: ${TARGET_ENV}"
echo "Frontend uploaded to s3://${S3_BUCKET_NAME}"
echo "CloudFront invalidated: ${CLOUDFRONT_DISTRIBUTION_ID}"
