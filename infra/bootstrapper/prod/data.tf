data "azurerm_key_vault_secret" "codecov_token" {
  name         = "codecov-token"
  key_vault_id = data.azurerm_key_vault.fims.id
}

data "azurerm_client_config" "current" {}

data "azurerm_subscription" "current" {}

data "azurerm_resource_group" "dashboards" {
  name = "dashboards"
}

data "azurerm_resource_group" "fims_weu_01" {
  name = "io-p-weu-fims-rg-01"
}

data "azuread_group" "admins" {
  display_name = local.adgroups.admins_name
}

data "azuread_group" "developers" {
  display_name = local.adgroups.devs_name
}

data "azurerm_resource_group" "com_itn_01" {
  name = "io-p-itn-com-rg-01"
}

data "azurerm_container_app_environment" "runner" {
  name                = local.runner.cae_name
  resource_group_name = local.runner.cae_resource_group_name
}

data "azurerm_key_vault" "fims" {
  name                = local.key_vault.name
  resource_group_name = local.key_vault.resource_group_name
}

data "azurerm_virtual_network" "common" {
  name                = local.vnet.name
  resource_group_name = data.azurerm_resource_group.common_itn_01.name
}

data "azurerm_resource_group" "common_itn_01" {
  name = local.common.itn_resource_group_name
}

data "azurerm_resource_group" "common_weu" {
  name = local.common.weu_resource_group_name
}

data "azurerm_resource_group" "fims" {
  name = "io-p-fims-rg"
}
