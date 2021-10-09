# Creates bucket to store logs
resource "aws_s3_bucket" "website_logs" {
  bucket = "${var.domain_name}-logs"
  acl    = "log-delivery-write"

  force_destroy = true

  tags = merge(local.tags, {
    Changed = formatdate("YYYY-MM-DD hh:mm ZZZ", timestamp())
  })

  lifecycle_rule {
    enabled = true

    expiration {
      days = 15
    }
  }

  lifecycle {
    ignore_changes = [tags["Changed"]]
  }
}

# Creates bucket to store the static website
resource "aws_s3_bucket" "website_root" {
  bucket = "${var.domain_name}-root"
  acl    = "public-read"

  force_destroy = true

  logging {
    target_bucket = aws_s3_bucket.website_logs.bucket
    target_prefix = "${var.domain_name}/"
  }

  website {
    index_document = "index.html"
    error_document = "404.html"
  }

  tags = merge(local.tags, {
    Changed = formatdate("YYYY-MM-DD hh:mm ZZZ", timestamp())
  })

  lifecycle {
    ignore_changes = [tags["Changed"]]
  }
}

# Creates bucket for the website handling the redirection (if required), e.g. from https://www.example.com to https://example.com
resource "aws_s3_bucket" "website_redirect" {
  bucket        = "${var.domain_name}-redirect"
  acl           = "public-read"
  force_destroy = true

  logging {
    target_bucket = aws_s3_bucket.website_logs.bucket
    target_prefix = "${var.domain_name}-redirect/"
  }

  website {
    redirect_all_requests_to = "https://${var.domain_name}"
  }

  tags = merge(local.tags, {
    Changed = formatdate("YYYY-MM-DD hh:mm ZZZ", timestamp())
  })

  lifecycle {
    ignore_changes = [tags["Changed"]]
  }
}

# Creates policy to allow public access to the S3 bucket
resource "aws_s3_bucket_policy" "update_website_root_bucket_policy" {
  bucket = aws_s3_bucket.website_root.id

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Id": "PolicyForWebsiteEndpointsPublicContent",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": [
        "${aws_s3_bucket.website_root.arn}/*",
        "${aws_s3_bucket.website_root.arn}"
      ]
    }
  ]
}
POLICY
}
