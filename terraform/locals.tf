locals {
  name_prefix           = "${var.project_name}-${var.environment}"
  create_prod_resources = var.environment == "prod"
  create_uat_resources  = var.environment == "uat"
  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
    Repository  = "grantmaestro-frontend"
  }

  prod_bucket_name         = "prod.${var.domain_name}-frontend"
  uat_bucket_name          = "uat.${var.domain_name}-frontend"
  prod_aliases             = ["app.${var.domain_name}"]
  uat_aliases              = [var.uat_domain_name]
  frontend_certificate_arn = var.cloudfront_certificate_arn != "" ? var.cloudfront_certificate_arn : aws_acm_certificate.frontend.arn
  route53_zone_id          = var.route53_zone_id != "" ? var.route53_zone_id : one(data.aws_route53_zone.primary[*].zone_id)

  # ACM returns the same validation CNAME for the apex and wildcard domain.
  # Static keys keep first-time Terraform plans valid while values are unknown.
  frontend_acm_validation_domains = {
    wildcard_root = "*.${var.domain_name}"
    wildcard_uat  = "*.uat.${var.domain_name}"
  }
  frontend_acm_validation_records = {
    for key, domain_name in local.frontend_acm_validation_domains : key => {
      name = one([
        for option in aws_acm_certificate.frontend.domain_validation_options :
        option.resource_record_name
        if option.domain_name == domain_name
      ])
      type = one([
        for option in aws_acm_certificate.frontend.domain_validation_options :
        option.resource_record_type
        if option.domain_name == domain_name
      ])
      value = one([
        for option in aws_acm_certificate.frontend.domain_validation_options :
        option.resource_record_value
        if option.domain_name == domain_name
      ])
    }
  }
}
