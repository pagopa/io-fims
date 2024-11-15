module "cosmos" {
  source = "../_modules/cosmos"

  location            = azurerm_resource_group.fims.location
  project             = local.project_legacy
  common_project      = local.common_project
  resource_group_name = azurerm_resource_group.fims.name
  tags                = local.tags
}
