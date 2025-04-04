locals {
  rp_example = {
    common_app_settings = {
      OIDC_ISSUER_URL          = "@Microsoft.KeyVault(VaultName=${var.key_vault.name};SecretName=op-app-base-url)",
      OIDC_CLIENT_ID           = "@Microsoft.KeyVault(VaultName=${var.key_vault.name};SecretName=rp-example-client-id)",
      OIDC_CLIENT_SECRET       = "@Microsoft.KeyVault(VaultName=${var.key_vault.name};SecretName=rp-example-client-secret)",
      OIDC_CLIENT_REDIRECT_URI = "@Microsoft.KeyVault(VaultName=${var.key_vault.name};SecretName=rp-example-redirect-uri)",
      SESSION_SECRET           = "@Microsoft.KeyVault(VaultName=${var.key_vault.name};SecretName=rp-example-session-secret)"
    }
  }
}

module "rp_example" {
  source = "git::https://github.com/pagopa/dx.git//infra/modules/azure_app_service_exposed?ref=main"

  environment = merge(var.environment, {
    app_name        = "rp-example",
    instance_number = "02"
  })

  tier = "test"

  resource_group_name = var.resource_group_name

  health_check_path = "/health"

  app_settings      = local.rp_example.common_app_settings
  slot_app_settings = local.rp_example.common_app_settings

  tags = var.tags
}

resource "azurerm_role_assignment" "key_vault_fims_rp_example_app_secrets_user" {
  scope                = var.key_vault.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = module.rp_example.app_service.app_service.principal_id
}
