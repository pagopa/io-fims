module "storage_account_fims_itn" {
  source  = "pagopa-dx/azure-storage-account/azurerm"
  version = "0.0.9"

  subnet_pep_id       = var.subnet_pep_id
  tags                = var.tags
  tier                = "l"
  environment         = merge(var.environment, { location = var.location, app_name = "fims", domain = null, instance_number = "01" })
  resource_group_name = var.resource_group_name

  subservices_enabled = {
    blob  = false
    file  = false
    queue = true
    table = false
  }

}

resource "azurerm_storage_queue" "config_itn" {
  name                 = "config-queue"
  storage_account_name = module.storage_account_fims_itn.name
}

resource "azurerm_storage_queue" "access_itn" {
  name                 = "access-queue"
  storage_account_name = module.storage_account_fims_itn.name
}

resource "azurerm_storage_queue" "export_itn" {
  name                 = "export-queue"
  storage_account_name = module.storage_account_fims_itn.name
}

resource "azurerm_storage_queue" "audit_events_itn" {
  name                 = "audit-events"
  storage_account_name = module.storage_account_fims_itn.name
}

resource "azurerm_storage_queue" "audit_events_poison_itn" {
  name                 = "${azurerm_storage_queue.audit_events_itn.name}-poison"
  storage_account_name = module.storage_account_fims_itn.name
}
