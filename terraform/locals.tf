locals {
  application             = ""
  component               = "website-configuration"
  namespace               = "${local.application}-${local.component}"
  team_email              = "ryan@ryan.pm"
  website_domain_redirect = "www.${var.domain_name}"

  tags = {
    Application = local.application
    Component   = local.component
    Environment = var.environment
    GitRepo     = ""
    Owner       = local.team_email
    ManagedBy   = "Terraform"
  }
}
