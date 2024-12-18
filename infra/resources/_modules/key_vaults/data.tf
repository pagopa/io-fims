data "azurerm_client_config" "current" {}

data "azuread_group" "adgroup_admin" {
  display_name = format("%s-adgroup-admin", var.common_project)
}

data "azuread_group" "adgroup_developers" {
  display_name = format("%s-adgroup-developers", var.common_project)
}

data "azuread_group" "adgroup_externals" {
  display_name = format("%s-adgroup-externals", var.common_project)
}

data "azuread_group" "adgroup_security" {
  display_name = format("%s-adgroup-security", var.common_project)
}

data "azurerm_user_assigned_identity" "managed_identity_fims_ci" {
  name                = "${var.project}-github-ci-identity"
  resource_group_name = local.resource_group_name_identity
}

data "azurerm_user_assigned_identity" "managed_identity_fims_cd" {
  name                = "${var.project}-github-cd-identity"
  resource_group_name = local.resource_group_name_identity
}

data "azurerm_key_vault" "common" {
  name                = "${var.common_project}-kv-common"
  resource_group_name = "${var.common_project}-rg-common"
}
