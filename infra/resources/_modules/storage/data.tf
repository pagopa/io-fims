data "azurerm_private_dns_zone" "privatelink_queue_core_windows_net" {
  name                = "privatelink.queue.core.windows.net"
  resource_group_name = var.virtual_network.resource_group_name
}

data "azurerm_virtual_network" "vnet_itn" {
  name                = "${var.project}-itn-common-vnet-01"
  resource_group_name = "${var.project}-itn-common-rg-01"
}

data "azurerm_subnet" "subnet_private_endpoints_itn" {
  name                 = "io-p-itn-pep-snet-01 "
  resource_group_name  = data.azurerm_virtual_network.vnet_itn.resource_group_name
  virtual_network_name = data.azurerm_virtual_network.vnet_itn.name
}
