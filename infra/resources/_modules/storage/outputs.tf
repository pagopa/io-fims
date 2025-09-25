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

