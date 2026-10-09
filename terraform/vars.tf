variable "aws_profile" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "log_level" {
  type = string
}

variable "environment" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "zone_id" {
  type = string
}
variable "application_origin_domain" {
  description = "Bare HTTP API hostname from terraform/runtime. Empty keeps the existing static site; set only after preview verification."
  type        = string
  default     = ""

  validation {
    condition     = var.application_origin_domain == "" || can(regex("^[a-z0-9-]+\\.execute-api\\.[a-z0-9-]+\\.amazonaws\\.com$", var.application_origin_domain))
    error_message = "Use the HTTP API origin_domain output without a scheme, path or trailing slash."
  }
}
