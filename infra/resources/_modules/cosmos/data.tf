data "azurerm_private_dns_zone" "privatelink_documents_azure_com" {
  name                = "privatelink.documents.azure.com"
  resource_group_name = local.resource_group_name_common
}

data "azurerm_subnet" "private_endpoints_subnet" {
  name                 = "pendpoints"
  resource_group_name  = local.resource_group_name_common
  virtual_network_name = "${var.common_project}-vnet-common"
}

data "azurerm_subnet" "private_endpoints_subnet_itn" {
  name                 = "io-p-itn-pep-snet-01"
  resource_group_name  = local.resource_group_name_common_itn
  virtual_network_name = "${var.common_project}-itn-common-vnet-01"
}

data "azurerm_monitor_action_group" "error_action_group" {
  name                = "${replace("${var.common_project}", "-", "")}error"
  resource_group_name = local.resource_group_name_common
}
