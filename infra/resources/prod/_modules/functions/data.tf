data "azurerm_application_insights" "application_insights" {
  name                = "${var.project}-ai-common"
  resource_group_name = local.resource_group_name_common
}

data "azurerm_virtual_network" "vnet_common" {
  name                = "${var.project}-vnet-common"
  resource_group_name = local.resource_group_name_common
}

data "azurerm_subnet" "private_endpoints_subnet" {
  name                 = "pendpoints"
  virtual_network_name = data.azurerm_virtual_network.vnet_common.name
  resource_group_name  = data.azurerm_virtual_network.vnet_common.resource_group_name
}

data "azurerm_private_dns_zone" "privatelink_azurewebsites_net" {
  name                = "privatelink.azurewebsites.net"
  resource_group_name = local.resource_group_name_common
}

data "azurerm_client_config" "current" {}
