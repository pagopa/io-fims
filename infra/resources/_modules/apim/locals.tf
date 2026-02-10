locals {
  product = "${var.prefix}-${var.env_short}"

  apim_itn_platform_name                = "${local.product}-itn-platform-api-gateway-apim-01"
  apim_itn_platform_resource_group_name = "${local.product}-itn-common-rg-01"
}
