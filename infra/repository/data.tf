data "azurerm_user_assigned_identity" "identity_prod_ci" {
  name                = "io-p-fims-github-ci-identity"
  resource_group_name = local.identity_resource_group_name
}

data "azurerm_user_assigned_identity" "identity_prod_cd" {
  name                = "io-p-fims-github-cd-identity"
  resource_group_name = local.identity_resource_group_name
}

data "azurerm_key_vault" "fims" {
  name                = "io-p-fims-kv"
  resource_group_name = "io-p-fims-rg"
}

data "azurerm_key_vault_secret" "codecov_token" {
  name         = "codecov-token"
  key_vault_id = data.azurerm_key_vault.fims.id
}

data "github_organization_teams" "all" {
  root_teams_only = true
  summary_only    = true
}
