terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
    }
  }
}

module "naming_convention" {
  source      = "github.com/pagopa/dx//infra/modules/azure_naming_convention?ref=5f795b96d84a866de514ab32199ba3f54286f702"
  environment = var.environment
}

resource "azurerm_resource_group" "this" {
  name     = "${module.naming_convention.prefix}-rg-${module.naming_convention.suffix}"
  location = var.environment.location
  tags     = var.tags
}
