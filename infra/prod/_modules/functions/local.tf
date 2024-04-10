locals {
  resource_group_name_common = "${var.project}-rg-common"

  relying_party_func = {
    app_settings     = {}
    staging_disabled = ["onSelfcareContractsMessage"]
  }

  user_func = {
    app_settings     = {}
    staging_disabled = ["onSelfcareContractsMessage"]
  }
}
