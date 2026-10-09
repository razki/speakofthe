locals {
  api_targets = toset(["live", "preview"])
}

resource "aws_apigatewayv2_api" "application" {
  for_each = local.api_targets

  name          = "${local.function_name}-${each.key}"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "application" {
  for_each = local.api_targets

  api_id                 = aws_apigatewayv2_api.application[each.key].id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  integration_uri        = each.key == "live" ? aws_lambda_alias.live.invoke_arn : aws_lambda_function.application.qualified_invoke_arn
  payload_format_version = "2.0"
  timeout_milliseconds   = 30000
}

resource "aws_apigatewayv2_route" "root" {
  for_each = local.api_targets

  api_id    = aws_apigatewayv2_api.application[each.key].id
  route_key = "ANY /"
  target    = "integrations/${aws_apigatewayv2_integration.application[each.key].id}"
}

resource "aws_apigatewayv2_route" "proxy" {
  for_each = local.api_targets

  api_id    = aws_apigatewayv2_api.application[each.key].id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.application[each.key].id}"
}

resource "aws_apigatewayv2_stage" "application" {
  for_each = local.api_targets

  api_id      = aws_apigatewayv2_api.application[each.key].id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "api" {
  for_each = local.api_targets

  statement_id  = "AllowHttpApi-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.application.function_name
  qualifier     = each.key == "live" ? aws_lambda_alias.live.name : aws_lambda_function.application.version
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.application[each.key].execution_arn}/*/*"
}
