module "appservice_fims" {
  source = "github.com/pagopa/terraform-azurerm-v3//app_service?ref=v7.67.1"

  plan_type = "internal"
  plan_name = "${var.product}-oidc-provider-plan"
  sku_name  = "B3"

  name                = "${var.product}-oidc-provider-app"
  resource_group_name = var.resource_group_name
  location            = var.location

  always_on        = true
  node_version     = "18-lts"
  app_command_line = "npm run start"

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
