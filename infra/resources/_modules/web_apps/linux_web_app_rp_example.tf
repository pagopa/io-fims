locals {
  rp_example = {
    common_app_settings = {
      OIDC_ISSUER_URL = "@Microsoft.KeyVault(VaultName=${var.key_vault.name};SecretName=op-oidc-issuer)"
    }
  }
}

module "rp_example" {
  source = "git::https://github.com/pagopa/dx.git//infra/modules/azure_app_service_exposed?ref=fix-app-service-exposed"

  environment = merge(var.environment, {
    app_name        = "rp-example",
    instance_number = "02"
  })

  tier = "test"

  resource_group_name = var.resource_group_name

  health_check_path = "/health"

  app_settings = merge(local.rp_example.common_app_settings, {
    NODE_ENVIRONMENT = "production"
  })

  slot_app_settings = merge(local.rp_example.common_app_settings, {
    NODE_ENVIRONMENT = "staging"
  })

  sticky_app_setting_names = ["NODE_ENVIRONMENT"]

  tags = var.tags
}

resource "azurerm_role_assignment" "key_vault_fims_rp_example_app_secrets_user" {
  scope                = var.key_vault.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = module.rp_example.app_service.app_service.principal_id
}
