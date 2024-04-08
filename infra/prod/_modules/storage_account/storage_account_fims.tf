module "storage_account_fims" {
  source = "github.com/pagopa/terraform-azurerm-v3//storage_account?ref=v7.76.0"

  name                          = replace("${var.product}st", "-", "")
  domain                        = upper(var.domain)
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
