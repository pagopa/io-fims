resource "azurerm_storage_queue" "config_queue" {
  name                 = "config-queue"
  storage_account_name = "${var.prefix}${var.env_short}${var.domain}st"
}
