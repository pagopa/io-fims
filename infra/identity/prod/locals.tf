locals {
  prefix    = "io"
  env_short = "p"
  env       = "prod"
  location  = "westeurope"
  project   = "${local.prefix}-${local.env_short}"
  domain    = "fims"

  repo_name = "io-fims"

  tags = {
    CostCenter  = "TS310 - PAGAMENTI & SERVIZI"
    CreatedBy   = "Terraform"
    Environment = "Prod"
    Owner       = "IO Comunicazione"
    Source      = "https://github.com/pagopa/io-fims"
  }
}
