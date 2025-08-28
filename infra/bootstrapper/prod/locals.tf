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
    name                     = "io-fims"
    description              = "This is the repository that contains all the funcftionalities regarding FIMS"
    topics                   = ["backend", "io", "comunicazione", "iocom"]
    reviewers_teams          = ["io-communication-backend", "engineering-team-cloud-eng"]
    default_branch_name      = "main"
    infra_cd_policy_branches = ["main"]
    opex_cd_policy_branches  = ["main"]
    app_cd_policy_branches   = ["main"]
    app_cd_policy_tags       = ["*@*"]
  }

  repo_secrets = {
    "ARM_TENANT_ID"       = data.azurerm_client_config.current.tenant_id,
    "ARM_SUBSCRIPTION_ID" = data.azurerm_subscription.current.subscription_id
    "CODECOV_TOKEN"       = data.azurerm_key_vault_secret.codecov_token.value
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
    name                = "io-p-fims-kv"
    resource_group_name = "io-p-fims-rg"
  }

  tags = {
    CreatedBy      = "Terraform"
    Environment    = "Prod"
    BusinessUnit   = "App IO"
    ManagementTeam = "IO Comunicazione"
    Source         = "https://github.com/pagopa/io-fims/tree/main/infra/repository"
    CostCenter     = "TS000 - Tecnologia e Servizi"
  }
}
