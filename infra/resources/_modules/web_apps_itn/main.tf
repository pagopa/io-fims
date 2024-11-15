terraform {

  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
    }
  }
}

provider "azurerm" {
  storage_use_azuread = true
  features {}
}
