provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Application = "speakofthe"
      Component   = "website-runtime"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
