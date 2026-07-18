#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TF_DIR="$ROOT_DIR/terraform"

usage() {
  cat <<USAGE
Usage:
  scripts/infra.sh <uat|prod> [plan|apply]

Examples:
  AWS_PROFILE=grantmaestro scripts/infra.sh uat apply
  AWS_PROFILE=grantmaestro scripts/infra.sh prod apply
USAGE
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

TARGET="$1"
ACTION="${2:-apply}"

if [[ "$ACTION" != "plan" && "$ACTION" != "apply" ]]; then
  echo "Action must be 'plan' or 'apply'." >&2
  usage
  exit 1
fi

case "$TARGET" in
  uat|prod)
    TFVARS="terraform.${TARGET}.tfvars"
    if [[ ! -f "$TF_DIR/$TFVARS" ]]; then
      echo "Missing $TF_DIR/$TFVARS. Copy $TFVARS.example and fill non-secret values first." >&2
      exit 1
    fi

    cd "$TF_DIR"
    terraform init -reconfigure
    terraform workspace select "$TARGET" || terraform workspace new "$TARGET"
    terraform validate
    if [[ "$ACTION" == "plan" ]]; then
      terraform plan -var-file="$TFVARS"
    else
      terraform apply -var-file="$TFVARS"
      echo
      echo "Frontend DNS records are managed automatically in Route53."
      echo
      echo "Requested frontend ACM certificate ARN:"
      terraform output -raw frontend_acm_certificate_arn
    fi
    ;;
  *)
    echo "Target must be 'uat' or 'prod'." >&2
    usage
    exit 1
    ;;
esac
