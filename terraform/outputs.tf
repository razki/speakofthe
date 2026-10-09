output "cloudfront_distribution_id" {
  description = "Existing apex distribution ID for reviewed cache invalidations."
  value       = aws_cloudfront_distribution.website_cdn_root.id
}

output "site_bucket" {
  description = "Existing public static asset bucket. Never upload the server ZIP here."
  value       = aws_s3_bucket.website_root.id
}
