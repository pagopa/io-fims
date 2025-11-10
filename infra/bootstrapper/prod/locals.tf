locals {
  prefix          = "io"
  env_short       = "p"
  location        = "italynorth"
  domain          = "fims"
  instance_number = "01"

  identity_resource_group_name = "io-p-identity-rg"

  adgroups = {
    admins_name = "io-p-adgroup-com-admins"
    devs_name   = "io-p-adgroup-com-developers"
  }

  tf_storage_account = {
    name                = "tfappprodio"
    resource_group_name = "terraform-state-rg"
  }

  repository = {
    name = "io-fims"
  }

  repo_secrets = {
    "CODECOV_TOKEN" = data.azurerm_key_vault_secret.codecov_token.value
  }

  runner = {
    cae_name                = "${local.prefix}-${local.env_short}-itn-github-runner-cae-01"
    cae_resource_group_name = "${local.prefix}-${local.env_short}-itn-github-runner-rg-01"
    secret = {
      kv_name                = "${local.prefix}-${local.env_short}-kv-common"
      kv_resource_group_name = "${local.prefix}-${local.env_short}-rg-common"
    }
  }

  vnet = {
    name                = "${local.prefix}-${local.env_short}-itn-common-vnet-01"
    resource_group_name = "${local.prefix}-${local.env_short}-itn-common-rg-01"
  }

  common = {
    weu_resource_group_name = "${local.prefix}-${local.env_short}-rg-common"
    itn_resource_group_name = "${local.prefix}-${local.env_short}-itn-common-rg-01"
  }

  key_vault = {
    name                = "io-p-itn-fims-kv-01"
    resource_group_name = "io-p-itn-fims-rg-01"
  }

  tags = {
    CreatedBy      = "Terraform"
    Environment    = "Prod"
    BusinessUnit   = "App IO"
    ManagementTeam = "IO Comunicazione"
    Source         = "https://github.com/pagopa/io-fims/tree/main/infra/bootstrapper/prod"
    CostCenter     = "TS000 - Tecnologia e Servizi"
  }
}
