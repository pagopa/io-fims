module "storage_account_fims" {
  source = "github.com/pagopa/terraform-azurerm-v3//storage_account?ref=v8.28.2"

  name                          = replace("${var.project}st", "-", "")
  account_kind                  = "StorageV2"
  account_tier                  = "Standard"
  access_tier                   = "Hot"
  account_replication_type      = "ZRS"
  resource_group_name           = var.resource_group_name
  location                      = var.location
  advanced_threat_protection    = true
  public_network_access_enabled = false

  tags = var.tags
}

resource "azurerm_storage_queue" "config_queue" {
  name                 = "config-queue"
  storage_account_name = module.storage_account_fims.name
}


module "azure_storage_account" {
  source = "github.com/pagopa/dx//infra/modules/azure_storage_account?ref=main"

  environment         = local.itn_environment
  resource_group_name = var.resource_group_name
  tier                = "l"

  ###TO CHECK
  subnet_pep_id                        = data.azurerm_subnet.subnet_pep_itn.id
  private_dns_zone_resource_group_name = "${local.prefix}-${local.env_short}-rg-common"

  subservices_enabled = {
    blob  = false
    file  = false
    queue = true
    table = false
  }

  force_public_network_access_enabled = false

  tags = var.tags
}
