output "resource_group_fims" {
  value = {
    id       = azurerm_resource_group.fims_01.id
    name     = azurerm_resource_group.fims_01.name
    location = azurerm_resource_group.fims_01.location
  }
}

output "resource_group_fims_legacy" {
  value = {
    id       = azurerm_resource_group.fims.id
    name     = azurerm_resource_group.fims.name
    location = azurerm_resource_group.fims.location
  }
}
