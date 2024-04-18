data "azurerm_nat_gateway" "nat_gateway" {
  name                = "${var.project}-natgw"
  resource_group_name = local.resource_group_name_common
}

data "azurerm_virtual_network" "vnet_common" {
  name                = "${var.project}-vnet-common"
  resource_group_name = local.resource_group_name_common
}

data "azurerm_subnet" "private_endpoints_subnet" {
  name                 = "pendpoints"
  virtual_network_name = "${var.project}-vnet-common"
  resource_group_name  = "${var.project}-rg-common"
}

data "azurerm_private_dns_zone" "privatelink_queue_core_windows_net" {
  name                = "privatelink.queue.core.windows.net"
  resource_group_name = "${var.project}-rg-common"
}
