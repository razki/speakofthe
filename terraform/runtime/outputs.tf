output "origin_domain" {
  description = "Production HTTP API hostname for the legacy stack's application_origin_domain."
  value       = trimprefix(aws_apigatewayv2_api.application["live"].api_endpoint, "https://")
}

output "api_endpoint" {
  description = "Stable endpoint invoking the verified live Lambda alias."
  value       = aws_apigatewayv2_api.application["live"].api_endpoint
}

output "preview_endpoint" {
  description = "Endpoint invoking the newly published candidate; smoke-test before promoting live."
  value       = aws_apigatewayv2_api.application["preview"].api_endpoint
}

output "function_name" {
  value = aws_lambda_function.application.function_name
}

output "candidate_version" {
  value = aws_lambda_function.application.version
}

output "live_alias_name" {
  value = aws_lambda_alias.live.name
}

output "execution_role_arn" {
  value = aws_iam_role.application.arn
}

output "artifact_bucket" {
  description = "Private release ZIP bucket; separate from the public static asset bucket."
  value       = aws_s3_bucket.artifacts.id
}
