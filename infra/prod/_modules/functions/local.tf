locals {
  resource_group_name_common = "${var.project}-rg-common"

  relying_party_func = {
    app_settings = {
      for s in var.rp_func.app_settings :
      s.name => s.key_vault_secret_name != null ? "@Microsoft.KeyVault(VaultName=${var.product}-kv;SecretName=${s.key_vault_secret_name})" : s.value
    }
    staging_disabled = ["onSelfcareContractsMessage"]
  }

  openid_provider_func = {
    app_settings = {
      for s in var.op_func.app_settings :
      s.name => s.key_vault_secret_name != null ? "@Microsoft.KeyVault(VaultName=${var.product}-kv;SecretName=${s.key_vault_secret_name})" : s.value
    }
    staging_disabled = []
  }
}
