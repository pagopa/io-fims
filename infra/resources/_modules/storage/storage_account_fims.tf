module "storage_account_fims" {
  source = "github.com/pagopa/terraform-azurerm-v3//storage_account?ref=v8.13.0"

  name                          = replace("${var.project}st", "-", "")
  account_kind                  = "StorageV2"
  account_tier                  = "Standard"
  access_tier                   = "Hot"
  account_replication_type      = "ZRS"
  resource_group_name           = var.resource_group_name
  location                      = var.location
  advanced_threat_protection    = true
  public_network_access_enabled = false

  tags = var.tags
}

resource "azurerm_storage_queue" "config_queue" {
  name                 = "config-queue"
  storage_account_name = module.storage_account_fims.name
}

resource "azurerm_events_queue" "events_queue" {
  name                 = "events-queue"
  storage_account_name = module.storage_account_fims.name
}
