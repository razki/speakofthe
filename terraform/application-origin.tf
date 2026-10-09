locals {
  application_enabled = var.application_origin_domain != ""
  application_origin  = "next-application"
  static_behaviors = [
    { path = "_next/static/*", default_ttl = 31536000 },
    { path = "assets/*", default_ttl = 86400 },
  ]
}

data "aws_cloudfront_cache_policy" "application" {
  count = local.application_enabled ? 1 : 0
  name  = "Managed-CachingDisabled"
}

data "aws_cloudfront_origin_request_policy" "application" {
  count = local.application_enabled ? 1 : 0
  name  = "Managed-AllViewerExceptHostHeader"
}
