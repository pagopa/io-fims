data "azurerm_client_config" "current" {}

data "azuread_group" "adgroup_admin" {
  display_name = format("%s-adgroup-admin", var.project)
}

data "azuread_group" "adgroup_developers" {
  display_name = format("%s-adgroup-developers", var.project)
}

data "azuread_group" "adgroup_externals" {
  display_name = format("%s-adgroup-externals", var.project)
}

data "azuread_group" "adgroup_security" {
  display_name = format("%s-adgroup-security", var.project)
}

data "azurerm_user_assigned_identity" "managed_identity_fims_ci" {
  name                = "${var.product}-github-ci-identity"
  resource_group_name = local.resource_group_name_identity
}

data "azurerm_user_assigned_identity" "managed_identity_fims_cd" {
  name                = "${var.product}-github-cd-identity"
  resource_group_name = local.resource_group_name_identity
}
