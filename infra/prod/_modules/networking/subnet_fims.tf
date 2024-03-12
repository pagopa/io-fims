module "fims_snet" {
  source               = "github.com/pagopa/terraform-azurerm-v3//subnet?ref=v7.67.1"
  name                 = "fims"
  resource_group_name  = data.azurerm_virtual_network.vnet_common.resource_group_name
  virtual_network_name = data.azurerm_virtual_network.vnet_common.name

  address_prefixes                          = [var.subnet_fims_cidr]
  private_endpoint_network_policies_enabled = true

  service_endpoints = [
    "Microsoft.Web",
  ]

  delegation = {
    name = "default"
    service_delegation = {
      name    = "Microsoft.Web/serverFarms"
      actions = ["Microsoft.Network/virtualNetworks/subnets/action"]
    }
  }
}
