module "storage_account_audit_st_itn" {
  source  = "pagopa-dx/azure-storage-account/azurerm"
  version = "0.0.9"

  subnet_pep_id       = var.subnet_pep_id
  tags                = var.tags
  tier                = "l"
  environment         = merge(var.environment, { location = var.location, app_name = "audit_st", domain = "fims", instance_number = "01" })
  resource_group_name = var.resource_group_name

  subservices_enabled = {
    blob  = true
    file  = false
    queue = true
    table = false
  }

  blob_features = {
    versioning = true
    immutability_policy = {
      enabled                       = true
      allow_protected_append_writes = false
      period_since_creation_in_days = 730
    }
    restore_policy_days = 0
    change_feed         = {}
  }

}

resource "azurerm_storage_container" "events_itn" {
  name                  = "events"
  storage_account_name  = module.storage_account_audit_st_itn.name
  container_access_type = "private"
}
