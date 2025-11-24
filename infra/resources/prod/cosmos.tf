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

  common_project          = local.common_project
  itn_resource_group_name = module.itn_resource_group.name
  tags                    = local.tags
}
