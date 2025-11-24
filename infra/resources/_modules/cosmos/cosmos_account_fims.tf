module "azure-cosmos-account" {
  source  = "pagopa-dx/azure-cosmos-account/azurerm"
  version = "0.3.0"

  resource_group_name = var.itn_resource_group_name

  environment = var.environment

  consistency_policy = {
    consistency_preset      = "Custom"
    consistency_level       = "Session"
    max_interval_in_seconds = null
    max_staleness_prefix    = null
  }

  secondary_geo_locations = [
    {
      location          = "spaincentral"
      failover_priority = 1
      zone_redundant    = false
    }
  ]

  alerts = {
    enabled = false
  }

  subnet_pep_id = data.azurerm_subnet.private_endpoints_subnet_itn.id

  tags = var.tags
}

resource "azurerm_role_assignment" "cosno_fims_com_admins" {
  scope                = module.azure-cosmos-account.id
  principal_id         = var.com_admins_azuread_group.object_id
  role_definition_name = "DocumentDB Account Contributor"
}

resource "azurerm_role_assignment" "cosno_fims_com_devs" {
  scope                = module.azure-cosmos-account.id
  principal_id         = var.com_devs_azuread_group.object_id
  role_definition_name = "DocumentDB Account Contributor"
}
