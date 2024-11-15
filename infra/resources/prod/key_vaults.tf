module "key_vaults" {
  source = "../_modules/key_vaults"

  resource_group_name = azurerm_resource_group.fims.name
  location            = azurerm_resource_group.fims.location
  project             = local.project_legacy
  common_project      = local.common_project

  tags = local.tags
}
