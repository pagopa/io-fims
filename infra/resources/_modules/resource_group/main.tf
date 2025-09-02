terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
    }
  }
}

module "naming_convention" {
  source      = "pagopa-dx/azure-naming-convention/azurerm"
  version     = "0.0.7"
  environment = var.environment
}

resource "azurerm_resource_group" "this" {
  name     = "${module.naming_convention.prefix}-rg-${module.naming_convention.suffix}"
  location = var.environment.location
  tags     = var.tags
}
