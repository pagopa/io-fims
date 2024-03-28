data "azurerm_api_management" "apim_v2_api" {
  name                = "${var.project}-apim-v2-api"
  resource_group_name = "${var.project}-rg-internal"
}
