output "prod_bucket_name" {
  value       = try(aws_s3_bucket.prod[0].bucket, null)
  description = "Production S3 bucket name."
}

output "uat_bucket_name" {
  value       = try(aws_s3_bucket.uat[0].bucket, null)
  description = "UAT S3 bucket name."
}

output "prod_distribution_id" {
  value       = try(aws_cloudfront_distribution.prod[0].id, null)
  description = "Production CloudFront distribution ID."
}

output "uat_distribution_id" {
  value       = try(aws_cloudfront_distribution.uat[0].id, null)
  description = "UAT CloudFront distribution ID."
}

output "prod_domain_name" {
  value       = try(aws_cloudfront_distribution.prod[0].domain_name, null)
  description = "Production CloudFront domain name."
}

output "uat_domain_name" {
  value       = try(aws_cloudfront_distribution.uat[0].domain_name, null)
  description = "UAT CloudFront domain name."
}

output "frontend_acm_certificate_arn" {
  value       = aws_acm_certificate.frontend.arn
  description = "Requested frontend wildcard ACM certificate ARN in us-east-1."
}

output "frontend_acm_dns_validation_records" {
  value = [
    for option in aws_acm_certificate.frontend.domain_validation_options : {
      domain = option.domain_name
      name   = option.resource_record_name
      type   = option.resource_record_type
      value  = option.resource_record_value
    }
  ]
  description = "DNS CNAME records to create at the DNS provider to validate the frontend wildcard ACM certificate."
}

output "frontend_external_dns_records" {
  value = concat(
    length(aws_cloudfront_distribution.uat) == 0 ? [] : [{
      name  = var.uat_domain_name
      type  = "CNAME"
      value = aws_cloudfront_distribution.uat[0].domain_name
    }],
    length(aws_cloudfront_distribution.prod) == 0 ? [] : [{
      name  = "app.${var.domain_name}"
      type  = "CNAME"
      value = aws_cloudfront_distribution.prod[0].domain_name
    }]
  )
  description = "External DNS records to create when Route53 is not managing grantmaestro.com."
}
