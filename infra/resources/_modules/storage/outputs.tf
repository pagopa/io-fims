output "fims" {
  value = {
    id                  = module.storage_account_fims.id
    name                = module.storage_account_fims.name
    resource_group_name = module.storage_account_fims.resource_group_name
    queues = {
      config       = azurerm_storage_queue.config
      access       = azurerm_storage_queue.access
      export       = azurerm_storage_queue.export
      audit_events = azurerm_storage_queue.audit_events
    }
  }
}

output "audit" {
  value = {
    id                  = module.audit_st.id
    name                = module.audit_st.name
    resource_group_name = module.audit_st.resource_group_name
    containers = {
      events = azurerm_storage_container.events
    }
  }
}

