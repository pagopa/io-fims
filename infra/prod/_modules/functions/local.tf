locals {
  resource_group_name_common = "${var.project}-rg-common"

  relying_party_func = {
    app_settings     = {}
    staging_disabled = ["onSelfcareContractsMessage"]
  }

  openid_provider_func = {
    app_settings     = {}
    staging_disabled = []
  }
}
