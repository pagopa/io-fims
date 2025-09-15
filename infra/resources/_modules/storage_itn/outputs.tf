output "fims_itn" {
  value = {
    id                  = module.storage_account_fims_itn.id
    name                = module.storage_account_fims_itn.name
    resource_group_name = module.storage_account_fims_itn.resource_group_name
    queues = {
      config       = azurerm_storage_queue.config_itn
      access       = azurerm_storage_queue.access_itn
      export       = azurerm_storage_queue.export_itn
      audit_events = azurerm_storage_queue.audit_events_itn
    }
  }
}

output "audit_itn" {
  value = {
    id                    = module.storage_account_audit_st_itn.id
    name                  = module.storage_account_audit_st_itn.name
    resource_group_name   = module.storage_account_audit_st_itn.resource_group_name
    primary_blob_endpoint = module.storage_account_audit_st_itn.primary_web_host
    containers = {
      events = azurerm_storage_container.events_itn
    }
  }
}
