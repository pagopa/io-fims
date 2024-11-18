module "key_vault" {
  source = "github.com/pagopa/terraform-azurerm-v3//key_vault?ref=v8.28.2"

  name                       = "${var.project}-kv"
  location                   = var.location
  resource_group_name        = var.resource_group_name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "premium"
  soft_delete_retention_days = 90
  enable_rbac_authorization  = true

  tags = var.tags
}

resource "azurerm_key_vault_key" "op_app" {
  name         = "op-app-key"
  key_vault_id = module.key_vault.id
  key_type     = "RSA"
  key_size     = 2048
  key_opts     = ["sign"]
}
