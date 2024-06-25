resource "azurerm_resource_group" "events_rg" {
  name     = "fims-events-rg"
  location = var.location
}

resource "azurerm_storage_account" "events_sa" {
  name                        = "fimseventssa"
  resource_group_name           = azurerm_resource_group.events_rg.name
  location                      = azurerm_resource_group.events_rg.location
  account_kind                  = "StorageV2"
  account_tier                  = "Standard"
  access_tier                   = "Hot"
  account_replication_type      = "ZRS"
  min_tls_version               = "TLS1_2"
  public_network_access_enabled = false

  blob_properties {
    versioning_enabled = true
  }

  immutability_policy {
    allow_protected_append_writes = true
    period_since_creation_in_days = 730
    state                         = "Locked"
  }
}

resource "azurerm_storage_container" "events_sc" {
  name                  = "fimseventsblob"
  storage_account_name  = azurerm_storage_account.events_sa.name
  container_access_type = "private"
}