data "azurerm_subnet" "private_endpoints_subnet_itn" {
  name                 = "io-p-itn-pep-snet-01"
  resource_group_name  = local.resource_group_name_common_itn
  virtual_network_name = "${var.common_project}-itn-common-vnet-01"
}
