module "appservice_openid_rp_example" {
  source = "github.com/pagopa/terraform-azurerm-v3//app_service?ref=v7.76.0"

  plan_type = "internal"
  plan_name = "openid-rp-example-plan"
  sku_name  = "S1"

  name                = "openid-rp-example"
  resource_group_name = var.resource_group_name
  location            = var.location

  always_on        = true
  node_version     = local.node_version
  app_command_line = local.app_cmd

  health_check_path            = "/info"
  health_check_maxpingfailures = 3

  app_settings = local.app_service_openid_rp_example.app_settings_common

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

module "appservice_openid_rp_example_staging" {
  source = "github.com/pagopa/terraform-azurerm-v3//app_service_slot?ref=v7.76.0"

  app_service_id   = module.appservice_openid_rp_example.id
  app_service_name = module.appservice_openid_rp_example.name

  name                = "staging"
  resource_group_name = var.resource_group_name
  location            = var.location

  always_on         = true
  node_version      = local.node_version
  app_command_line  = local.app_cmd
  health_check_path = "/info"

  app_settings = local.app_service_openid_rp_example.app_settings_common

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
