terraform {

  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "tfappprodio"
    container_name       = "terraform-state"
    key                  = "io-fims.infra.tfstate"
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "<= 3.112.0"
    }

    azuread = {
      source  = "hashicorp/azuread"
      version = "<= 2.47.0"
    }
  }
}

provider "azurerm" {
  features {}
}
