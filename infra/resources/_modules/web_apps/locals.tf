locals {

  resource_group_name_common = "${var.project}-rg-common"

  node_version = "20-lts"
  app_cmd      = "node ."

  app_service_openid_rp_example = {
    app_settings_common = {}
  }

  relying_party_func = {
    app_settings = {
      for s in var.rp_func.app_settings :
      s.name => s.key_vault_secret_name != null ? "@Microsoft.KeyVault(VaultName=${var.product}-kv;SecretName=${s.key_vault_secret_name})" : s.value
    }
    staging_disabled = []
  }

  openid_provider_func = {
    app_settings = {
      for s in var.op_func.app_settings :
      s.name => s.key_vault_secret_name != null ? "@Microsoft.KeyVault(VaultName=${var.product}-kv;SecretName=${s.key_vault_secret_name})" : s.value
    }
    staging_disabled = []
  }

  user_func = {
    app_settings = {
      for s in var.user_func.app_settings :
      s.name => s.key_vault_secret_name != null ? "@Microsoft.KeyVault(VaultName=${var.product}-kv;SecretName=${s.key_vault_secret_name})" : s.value
    }
    staging_disabled = []
  }
}
