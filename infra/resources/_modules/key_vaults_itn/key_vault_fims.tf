resource "azurerm_key_vault" "fims_itn_key_vault" {
  name = provider::dx::resource_name({
    prefix          = var.prefix
    name            = "fims",
    resource_type   = "key_vault",
    environment     = var.env_short,
    location        = var.location
    instance_number = 1
  })

  location                 = var.location
  resource_group_name      = var.resource_group_name
  tenant_id                = data.azurerm_client_config.current.tenant_id
  purge_protection_enabled = true

  soft_delete_retention_days = 90

  tags = var.tags

  sku_name = "premium"

  enable_rbac_authorization = true
}


resource "azurerm_key_vault_key" "op_app" {
  name         = "op-app-key"
  key_vault_id = azurerm_key_vault.fims_itn_key_vault.id
  key_type     = "RSA"
  key_size     = 2048
  key_opts     = ["sign"]
}
