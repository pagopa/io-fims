output "fims" {
  value = {
    id   = module.storage_account_fims.id
    name = module.storage_account_fims.name
    queues = {
      config = {
        name = azurerm_storage_queue.config_queue.name
      }
    }
  }
}

output "fimsevent" {
  value = {
    id   = module.storage_account_event.id
    name = module.storage_account_event.name
  }
}

