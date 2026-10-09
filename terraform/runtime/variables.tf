variable "aws_region" {
  description = "AWS region for the Lambda runtime, HTTP APIs and private artifacts."
  type        = string
  default     = "eu-central-1"
}

variable "environment" {
  description = "Deployment environment used in resource names and tags."
  type        = string
  default     = "prod"

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{0,15}$", var.environment))
    error_message = "Use a lowercase environment name of at most 16 characters."
  }
}

variable "artifact_path" {
  description = "Linux x86_64 standalone Next.js ZIP containing run.sh at its root; never upload it to the public website bucket."
  type        = string
  default     = "../../.deploy/function.zip"
}

variable "contact_email" {
  description = "Server-only contact address. Supply through TF_VAR_contact_email; do not commit a tfvars value. Terraform state contains this sensitive value."
  type        = string
  sensitive   = true

  validation {
    condition     = can(regex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", var.contact_email))
    error_message = "A valid contact email address is required."
  }
}
