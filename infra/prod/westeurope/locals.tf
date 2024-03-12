locals {
  env_short = "p"
  prefix    = "io"
  domain    = "fims"
  project   = "${local.prefix}-${local.env_short}"
  product   = "${local.prefix}-${local.env_short}-${local.domain}"

  location = "westeurope"

  tags = {
    CostCenter  = "TS310 - PAGAMENTI & SERVIZI"
    CreatedBy   = "Terraform"
    Environment = "Prod"
    Owner       = "IO Comunicazione"
    Source      = "https://github.com/pagopa/io-fims/blob/main/infra/prod/westeurope"
  }
}
