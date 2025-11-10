module "cosmosdb_account_fims" {
  source = "github.com/pagopa/terraform-azurerm-v3//cosmosdb_account?ref=v8.28.2"

  name                = "${var.project}-cosmos"
  domain              = "fims"
  location            = var.location
  resource_group_name = var.resource_group_name

  enable_free_tier = false
  kind             = "GlobalDocumentDB"

  capabilities = [
    "EnableServerless"
  ]

  public_network_access_enabled     = false
  private_endpoint_enabled          = true
  private_dns_zone_sql_ids          = [data.azurerm_private_dns_zone.privatelink_documents_azure_com.id]
  subnet_id                         = data.azurerm_subnet.private_endpoints_subnet.id
  is_virtual_network_filter_enabled = false

  main_geo_location_location       = var.location
  main_geo_location_zone_redundant = true

  consistency_policy = {
    consistency_level       = "Session"
    max_interval_in_seconds = null
    max_staleness_prefix    = null
  }

  action = [
    {
      action_group_id    = data.azurerm_monitor_action_group.error_action_group.id
      webhook_properties = {}
    }
  ]

  tags = var.tags
}

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
