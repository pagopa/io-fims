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

  # Needed for immtability policy
  blob_versioning_enabled = true

  blob_storage_policy = {
    enable_immutability_policy = true
    blob_restore_policy_days   = 0
  }
  
  immutability_policy_props = {
    allow_protected_append_writes = false
    period_since_creation_in_days = 730
  }
}

resource "azurerm_storage_container" "event_sc" {
  name                  = "fims-event-blob"
  storage_account_name  = module.storage_account_event.name
  container_access_type = "private"
}