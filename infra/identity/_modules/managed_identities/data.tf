data "azurerm_client_config" "current" {}

data "azurerm_key_vault" "kv_citizen" {
  name                = "${var.prefix}-${var.env_short}-citizen-auth-kv"
  resource_group_name = "${var.prefix}-${var.env_short}-citizen-auth-sec-rg"
}
