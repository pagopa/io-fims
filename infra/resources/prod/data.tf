data "azurerm_application_insights" "common" {
  name                = "io-p-ai-common"
  resource_group_name = "${local.common_project}-rg-common"
}
