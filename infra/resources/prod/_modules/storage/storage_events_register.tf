resource "azurerm_resource_group" "events_rg" {
  name     = "fims-events-rg"
  location = var.location
}

resource "azurerm_storage_account" "events_sa" {
  name                     = "fims-events-sa"
  resource_group_name      = azurerm_resource_group.events_rg.name
  location                 = azurerm_resource_group.events_rg.location
  account_kind             = "StorageV2"
  account_tier             = "Standard"
  access_tier              = "Hot"
  account_replication_type = "ZRS"
  min_tls_version          = "TLS1_2"

  blob_properties {
    versioning_enabled = true
  }
}

resource "azurerm_storage_container" "events_sc" {
  name                  = "fims-events-blob"
  storage_account_name  = azurerm_storage_account.events_sa.name
  container_access_type = "private"
}

resource "azurerm_storage_container_immutability_policy" "events_policy" {
  storage_container_resource_manager_id = azurerm_storage_container.events_sc.resource_manager_id
  immutability_period_in_days           = 24 * 30
  protected_append_writes_all_enabled   = false
  protected_append_writes_enabled       = true
}