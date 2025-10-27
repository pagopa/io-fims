module "cosmos" {
  source = "../_modules/cosmos"

  providers = {
    azurerm = azurerm
  }

  environment = {
    prefix          = local.prefix
    env_short       = local.env_short
    location        = local.location
    app_name        = "fims"
    instance_number = "01"
  }

  com_admins_azuread_group = data.azuread_group.com_admins
  com_devs_azuread_group   = data.azuread_group.com_devs

  location                = azurerm_resource_group.fims.location
  project                 = local.project_legacy
  common_project          = local.common_project
  resource_group_name     = azurerm_resource_group.fims.name
  itn_resource_group_name = module.itn_resource_group.name
  tags                    = local.tags
}
