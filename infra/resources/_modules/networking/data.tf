data "azurerm_nat_gateway" "nat_gateway" {
  name                = "${var.common_project}-natgw"
  resource_group_name = local.resource_group_name_common
}

data "azurerm_virtual_network" "vnet_common" {
  name                = "${var.common_project}-vnet-common"
  resource_group_name = local.resource_group_name_common
}

data "azurerm_subnet" "pep" {
  name                 = "pendpoints"
  virtual_network_name = data.azurerm_virtual_network.vnet_common.name
  resource_group_name  = local.resource_group_name_common
}
