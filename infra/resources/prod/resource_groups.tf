resource "azurerm_resource_group" "fims" {
  name     = "${local.project_legacy}-rg"
  location = local.location_legacy
  tags     = local.tags
}


module "weu_resource_group" {
  source = "../_modules/resource_group"

  environment = {
    prefix          = local.prefix
    env_short       = local.env_short
    location        = local.location_legacy
    app_name        = "fims"
    instance_number = "01"
  }

  tags = local.tags
}

module "itn_resource_group" {
  source = "../_modules/resource_group"

  environment = {
    prefix          = local.prefix
    env_short       = local.env_short
    location        = local.location
    app_name        = "fims"
    instance_number = "01"
  }

  tags = local.tags
}
