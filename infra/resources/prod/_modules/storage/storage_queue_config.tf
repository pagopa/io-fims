resource "azurerm_storage_queue" "config_queue" {
  name                 = "config-queue"
  storage_account_name = module.storage_account_fims.name
}
