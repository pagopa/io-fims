output "virtual_network" {
  value = {
    id                  = data.azurerm_virtual_network.vnet_common.id
    name                = data.azurerm_virtual_network.vnet_common.name
    resource_group_name = data.azurerm_virtual_network.vnet_common.resource_group_name
  }
}

output "subnet_fims" {
  value = {
    id   = module.fims_snet.id
    name = module.fims_snet.name
  }
}

output "subnet_pep" {
  value = {
    id   = data.azurerm_subnet.pep.id
    name = data.azurerm_subnet.pep.name
  }
}
