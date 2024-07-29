module "storage_account_event" {
  source = "github.com/pagopa/terraform-azurerm-v3//storage_account?ref=v8.13.0"

  name                          = replace("${var.project}eventst", "-", "")
  account_kind                  = "StorageV2"
  account_tier                  = "Standard"
  access_tier                   = "Hot"
  account_replication_type      = "ZRS"
  min_tls_version               = "TLS1_2"
  resource_group_name           = var.resource_group_name
  location                      = var.location
  advanced_threat_protection    = true
  public_network_access_enabled = false

  tags = var.tags

  blob_properties {
    versioning_enabled = true
  }

  immutability_policy {
    allow_protected_append_writes = true
    period_since_creation_in_days = 730
    state                         = "Locked"
  }
}

resource "azurerm_storage_container" "event_sc" {
  name                  = "fims-event-blob"
  storage_account_name  = module.storage_account_event.name
  container_access_type = "private"
}