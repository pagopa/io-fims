module "appservice_fims" {
  source = "github.com/pagopa/terraform-azurerm-v3//app_service?ref=v7.67.1"

  plan_type = "internal"
  plan_name = "${var.product}-openid-provider-plan"
  sku_name  = "S1"

  name                = "${var.product}-openid-provider-app"
  resource_group_name = var.resource_group_name
  location            = var.location

  always_on        = true
  node_version     = local.node_version
  app_command_line = local.app_cmd

  health_check_path            = "/info"
  health_check_maxpingfailures = 3

  app_settings = local.app_service_fims_oidc_provider.app_settings_common

  allowed_subnets = [
    data.azurerm_subnet.subnet_appgw.id,
    data.azurerm_subnet.subnet_apim.id,
  ]

  allowed_ips = concat(
    [],
  )

  subnet_id        = var.subnet_id
  vnet_integration = true

  tags = var.tags
}

module "appservice_fims_slot_staging" {
  source = "github.com/pagopa/terraform-azurerm-v3//app_service_slot?ref=v7.67.1"

  app_service_id   = module.appservice_fims.id
  app_service_name = module.appservice_fims.name

  name                = "staging"
  resource_group_name = var.resource_group_name
  location            = var.location

  always_on         = true
  node_version      = local.node_version
  app_command_line  = local.app_cmd
  health_check_path = "/info"

  app_settings = local.app_service_fims_oidc_provider.app_settings_common

  allowed_subnets = [
    data.azurerm_subnet.subnet_azdoa.id,
    data.azurerm_subnet.subnet_appgw.id,
    data.azurerm_subnet.subnet_apim.id,
  ]

  allowed_ips = concat(
    [],
  )

  subnet_id        = var.subnet_id
  vnet_integration = true

  tags = var.tags
}
