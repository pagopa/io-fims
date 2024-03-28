output "apim" {
  value = {
    id                  = data.azurerm_api_management.apim_v2_api.id
    name                = data.azurerm_api_management.apim_v2_api.name
    resource_group_name = data.azurerm_api_management.apim_v2_api.resource_group_name
  }
}
