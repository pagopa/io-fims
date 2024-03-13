data "azurerm_application_insights" "application_insights" {
  name                = "${var.project}-ai-common"
  resource_group_name = local.resource_group_name_common
}

data "azurerm_virtual_network" "vnet_common" {
  name                = "${var.project}-vnet-common"
  resource_group_name = local.resource_group_name_common
}

data "azurerm_subnet" "subnet_appgw" {
  name                 = "${var.project}-appgateway-snet"
  virtual_network_name = data.azurerm_virtual_network.vnet_common.name
  resource_group_name  = data.azurerm_virtual_network.vnet_common.resource_group_name
}

data "azurerm_subnet" "subnet_apim" {
  name                 = "apimv2api"
  virtual_network_name = data.azurerm_virtual_network.vnet_common.name
  resource_group_name  = data.azurerm_virtual_network.vnet_common.resource_group_name
}

data "azurerm_key_vault_secret" "cookies_key_fims" {
  name         = "${var.project}-fims-cookies-key"
  key_vault_id = var.key_vault_id
}

data "azurerm_key_vault_secret" "jwk_primary_key_fims" {
  name         = "${var.project}-fims-jwk-primary-key"
  key_vault_id = var.key_vault_id
}
