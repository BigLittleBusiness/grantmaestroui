variable "aws_region" {
  type        = string
  description = "AWS region for S3 and CloudFront support resources."
  default     = "ap-southeast-2"
}

variable "project_name" {
  type        = string
  description = "Project name used in resource names."
  default     = "grantmaestro"
}

variable "environment" {
  type        = string
  description = "Environment name."
  default     = "prod"
}

variable "domain_name" {
  type        = string
  description = "Primary frontend domain."
  default     = "grantmaestro.com"
}

variable "uat_domain_name" {
  type        = string
  description = "UAT frontend domain."
  default     = "app.uat.grantmaestro.com"
}

variable "route53_zone_id" {
  type        = string
  description = "Optional Route 53 hosted zone ID for DNS records."
  default     = ""
}

variable "cloudfront_certificate_arn" {
  type        = string
  description = "Existing ACM certificate ARN in us-east-1 for CloudFront. Optional; Terraform also requests a wildcard cert and outputs DNS validation records."
  default     = ""
}

variable "cloudfront_use_custom_domain" {
  type        = bool
  description = "Attach app.grantmaestro.com/app.uat.grantmaestro.com aliases to CloudFront. Keep false until the ACM certificate is issued."
  default     = false
}

variable "force_destroy" {
  type        = bool
  description = "Allow Terraform to destroy buckets without manual emptying."
  default     = false
}
