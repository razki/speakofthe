locals {
  function_name = "speakofthe-${var.environment}"
}

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "application" {
  name               = "${local.function_name}-runtime"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_cloudwatch_log_group" "application" {
  name              = "/aws/lambda/${local.function_name}"
  retention_in_days = 14
}

data "aws_iam_policy_document" "application_logs" {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["${aws_cloudwatch_log_group.application.arn}:*"]
  }
}

resource "aws_iam_role_policy" "application_logs" {
  name   = "write-application-logs"
  role   = aws_iam_role.application.id
  policy = data.aws_iam_policy_document.application_logs.json
}

resource "aws_lambda_function" "application" {
  function_name = local.function_name
  description   = "SPEAKOFTHE Next.js application through AWS Lambda Web Adapter"
  role          = aws_iam_role.application.arn
  runtime       = "nodejs22.x"
  handler       = "run.sh"
  architectures = ["x86_64"]
  memory_size   = 1024
  timeout       = 30
  publish       = true

  s3_bucket         = aws_s3_bucket.artifacts.id
  s3_key            = aws_s3_object.application.key
  s3_object_version = aws_s3_object.application.version_id
  source_code_hash  = filebase64sha256(var.artifact_path)

  # Published AWS layer from the official nextjs-zip Web Adapter example.
  layers = ["arn:aws:lambda:${var.aws_region}:753240598075:layer:LambdaAdapterLayerX86:30"]

  environment {
    variables = {
      AWS_LAMBDA_EXEC_WRAPPER                = "/opt/bootstrap"
      AWS_LWA_PORT                           = "8000"
      AWS_LWA_READINESS_CHECK_PATH           = "/robots.txt"
      AWS_LWA_READINESS_CHECK_HEALTHY_STATUS = "200"
      AWS_LWA_ENABLE_COMPRESSION             = "true"
      AWS_LWA_INVOKE_MODE                    = "buffered"
      PORT                                   = "8000"
      NODE_ENV                               = "production"
      NEXT_PUBLIC_SITE_URL                   = "https://speakofthe.com"
      CONTACT_EMAIL                          = var.contact_email
    }
  }

  depends_on = [aws_iam_role_policy.application_logs]
}

resource "aws_lambda_alias" "live" {
  name             = "live"
  description      = "Verified release; promotion is performed after preview smoke checks."
  function_name    = aws_lambda_function.application.function_name
  function_version = aws_lambda_function.application.version

  # First creation initializes the alias. Subsequent applies publish only a
  # candidate; the deployment pipeline promotes or rolls back this alias.
  lifecycle {
    ignore_changes = [function_version]
  }
}
