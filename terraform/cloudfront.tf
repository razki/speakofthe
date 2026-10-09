# Preserves the existing distribution; application routing is explicitly opt-in.
resource "aws_cloudfront_distribution" "website_cdn_root" {
  enabled     = true
  price_class = "PriceClass_All"

  aliases = [var.domain_name]

  origin {
    origin_id   = "origin-bucket-${aws_s3_bucket.website_root.id}"
    domain_name = aws_s3_bucket.website_root.website_endpoint

    custom_origin_config {
      origin_protocol_policy = "http-only"
      # The existing S3 website endpoint supports HTTP only.
      http_port            = 80
      https_port           = 443
      origin_ssl_protocols = ["TLSv1.2", "TLSv1.1", "TLSv1"]
    }
  }

  dynamic "origin" {
    for_each = local.application_enabled ? [var.application_origin_domain] : []

    content {
      origin_id   = local.application_origin
      domain_name = origin.value

      custom_origin_config {
        origin_protocol_policy = "https-only"
        http_port              = 80
        https_port             = 443
        origin_ssl_protocols   = ["TLSv1.2"]
      }
    }
  }

  default_root_object = local.application_enabled ? null : "index.html"

  logging_config {
    bucket = aws_s3_bucket.website_logs.bucket_domain_name
    prefix = "${var.domain_name}/"
  }

  default_cache_behavior {
    allowed_methods  = local.application_enabled ? ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"] : ["GET", "HEAD", "OPTIONS"]
    cached_methods   = local.application_enabled ? ["GET", "HEAD"] : ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.application_enabled ? local.application_origin : "origin-bucket-${aws_s3_bucket.website_root.id}"

    cache_policy_id          = local.application_enabled ? data.aws_cloudfront_cache_policy.application[0].id : null
    origin_request_policy_id = local.application_enabled ? data.aws_cloudfront_origin_request_policy.application[0].id : null
    min_ttl                  = local.application_enabled ? null : 0
    default_ttl              = local.application_enabled ? null : 300
    max_ttl                  = local.application_enabled ? null : 1200

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    dynamic "forwarded_values" {
      for_each = local.application_enabled ? [] : [true]

      content {
        query_string = false
        cookies {
          forward = "none"
        }
      }
    }
  }

  # Next.js hashed bundles and public assets stay on the existing S3 origin.
  # Application HTML, RSC requests, metadata and API responses bypass caching.
  dynamic "ordered_cache_behavior" {
    for_each = local.application_enabled ? local.static_behaviors : []

    content {
      path_pattern     = ordered_cache_behavior.value.path
      allowed_methods  = ["GET", "HEAD", "OPTIONS"]
      cached_methods   = ["GET", "HEAD", "OPTIONS"]
      target_origin_id = "origin-bucket-${aws_s3_bucket.website_root.id}"
      min_ttl          = 0
      default_ttl      = ordered_cache_behavior.value.default_ttl
      max_ttl          = 31536000

      viewer_protocol_policy = "redirect-to-https"
      compress               = true

      forwarded_values {
        query_string = false
        cookies {
          forward = "none"
        }
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.wildcard_website.arn
    ssl_support_method  = "sni-only"
  }

  dynamic "custom_error_response" {
    for_each = local.application_enabled ? [] : [true]

    content {
      error_caching_min_ttl = 300
      error_code            = 404
      response_page_path    = "/404.html"
      response_code         = 404
    }
  }

  tags = merge(local.tags, {
    Changed = formatdate("YYYY-MM-DD hh:mm ZZZ", timestamp())
  })

  lifecycle {
    ignore_changes = [
      tags["Changed"],
      viewer_certificate,
    ]
  }
}

# Creates the CloudFront distribution to serve the redirection website (if redirection is required)
resource "aws_cloudfront_distribution" "website_cdn_redirect" {
  enabled     = true
  price_class = "PriceClass_All"
  # Select the correct PriceClass depending on who the CDN is supposed to serve (https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PriceClass.html)
  aliases = [local.website_domain_redirect]

  origin {
    origin_id   = "origin-bucket-${aws_s3_bucket.website_redirect.id}"
    domain_name = aws_s3_bucket.website_redirect.website_endpoint

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  logging_config {
    bucket = aws_s3_bucket.website_logs.bucket_domain_name
    prefix = "${local.website_domain_redirect}/"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "origin-bucket-${aws_s3_bucket.website_redirect.id}"
    min_ttl          = "0"
    default_ttl      = "300"
    max_ttl          = "1200"

    viewer_protocol_policy = "redirect-to-https" # Redirects any HTTP request to HTTPS
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.wildcard_website.arn
    ssl_support_method  = "sni-only"
  }

  tags = merge(local.tags, {
    Changed = formatdate("YYYY-MM-DD hh:mm ZZZ", timestamp())
  })

  lifecycle {
    ignore_changes = [
      tags["Changed"],
      viewer_certificate,
    ]
  }
}

