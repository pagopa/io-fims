locals {

  prefix = "io"
  domain = "fims"

  env_short = "p"

  location       = "italynorth"
  location_short = "itn"

  common_project = "${local.prefix}-${local.env_short}" # example: io-p

  project = "${local.prefix}-${local.env_short}-${local.location_short_legacy}-${local.domain}" # example: io-p-weu-fims

  # legacy #
  location_legacy       = "westeurope"
  location_short_legacy = "weu"
  project_legacy        = "${local.prefix}-${local.env_short}-${local.domain}" # example: io-p-fims

  tags = {
    CostCenter     = "TS000 - Tecnologia e Servizi"
    CreatedBy      = "Terraform"
    Environment    = "Prod"
    BusinessUnit   = "App IO"
    ManagementTeam = "IO Comunicazione"
    Source         = "https://github.com/pagopa/io-messages/blob/main/infra/resources/prod"
  }
}
