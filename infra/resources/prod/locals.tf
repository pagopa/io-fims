locals {
  prefix = "io"
  domain = "fims"

  env_short = "p"

  location       = "westeurope"
  location_short = "weu"

  common_project = "${local.prefix}-${local.env_short}"

  project        = "${local.prefix}-${local.env_short}-${local.location_short}-${local.domain}"
  project_legacy = "${local.prefix}-${local.env_short}-${local.domain}"

  tags = {
    CostCenter  = "TS310 - PAGAMENTI & SERVIZI"
    CreatedBy   = "Terraform"
    Environment = "Prod"
    Owner       = "IO Comunicazione"
    Source      = "https://github.com/pagopa/io-fims/blob/main/infra/prod/westeurope"
  }
}
