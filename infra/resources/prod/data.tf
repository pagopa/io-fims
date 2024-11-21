data "azurerm_application_insights" "common" {
  name                = "io-p-ai-common"
  resource_group_name = "${local.common_project}-rg-common"
}

# weu

data "azurerm_nat_gateway" "nat_gateway" {
  name                = "${local.common_project}-natgw"
  resource_group_name = "${local.common_project}-rg-common"
}

data "azurerm_virtual_network" "vnet_common" {
  name                = "${local.common_project}-vnet-common"
  resource_group_name = "${local.common_project}-rg-common"
}

data "azurerm_subnet" "pendpoints" {
  name                 = "pendpoints"
  virtual_network_name = data.azurerm_virtual_network.vnet_common.name
  resource_group_name  = "${local.common_project}-rg-common"
}

# itn

data "azurerm_nat_gateway" "itn" {
  name                = "${local.common_project}-itn-ng-01"
  resource_group_name = "${local.common_project}-itn-common-rg-01"
}

data "azurerm_virtual_network" "itn_common" {
  name                = "${local.common_project}-itn-common-vnet-01"
  resource_group_name = "${local.common_project}-itn-common-rg-01"
}

data "azurerm_subnet" "itn_pep" {
  name                 = "${local.common_project}-itn-pep-snet-01"
  virtual_network_name = data.azurerm_virtual_network.itn_common.name
  resource_group_name  = "${local.common_project}-itn-common-rg-01"
}
