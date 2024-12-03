module "web_apps" {
  source = "../_modules/web_apps"

  resource_group_name = module.weu_resource_group.name

  environment = {
    prefix    = local.prefix
    env_short = local.env_short
    location  = local.location_legacy
    domain    = local.domain
  }

  tags = local.tags

  # networking
  virtual_network = data.azurerm_virtual_network.vnet_common
  subnet_pep_id   = data.azurerm_subnet.pendpoints.id

  subnet_cidrs = {
    op_app     = "10.0.20.0/26"
    op_func    = "10.0.20.64/26"
    user_func  = "10.0.20.128/26"
    rp_example = "10.0.19.0/28"
  }

  # backing services

  key_vault            = module.key_vaults.fims
  cosmosdb_account     = module.cosmos.fims
  storage              = module.storage.fims
  audit_storage        = module.storage.audit
  redis_cache          = module.redis_cache.fims
  application_insights = data.azurerm_application_insights.common

  key_vault_common = module.key_vaults.common
}

module "web_apps_itn" {
  source = "../_modules/web_apps_itn"

  resource_group_name = module.itn_resource_group.name
  tags                = local.tags

  environment = {
    prefix    = local.prefix
    env_short = local.env_short
    location  = module.itn_resource_group.location
    domain    = local.domain
  }

  # networking
  virtual_network = data.azurerm_virtual_network.itn_common
  subnet_pep_id   = data.azurerm_subnet.itn_pep.id
  subnet_cidrs = {
    op_app    = "10.20.23.0/26"
    op_func   = "10.20.23.64/26"
    user_func = "10.20.23.128/26"
  }
  private_dns_zone_resource_group_name = "${local.common_project}-rg-common"

  # backing services
  key_vault            = module.key_vaults.fims
  redis_cache          = module.redis_cache.fims
  cosmosdb_account     = module.cosmos.fims
  storage              = module.storage.fims
  audit_storage        = module.storage.audit
  application_insights = data.azurerm_application_insights.common
  key_vault_common     = module.key_vaults.common
}
