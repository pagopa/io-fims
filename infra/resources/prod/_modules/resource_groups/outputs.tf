output "resource_group_fims" {
  value = {
    id       = azurerm_resource_group.fims.id
    name     = azurerm_resource_group.fims.name
    location = azurerm_resource_group.fims.location
  }
}
