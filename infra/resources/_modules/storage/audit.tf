module "audit_st" {
  source = "github.com/pagopa/dx//infra/modules/azure_storage_account?ref=5f795b96d84a866de514ab32199ba3f54286f702"

  resource_group_name = var.resource_group_name

  environment = merge(var.environment, {
    app_name        = "audit",
    instance_number = "01"
  })

  subnet_pep_id = var.subnet_pep_id

  subservices_enabled = {
    blob  = true
    queue = true
  }

  tier = "l"

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

  tags = var.tags
}

resource "azurerm_storage_container" "events" {
  name                  = "events"
  storage_account_name  = module.audit_st.name
  container_access_type = "private"
}
