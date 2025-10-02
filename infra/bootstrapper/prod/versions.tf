terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.94.0"
    }

    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "iopitntfst001"
    container_name       = "terraform-state"
    key                  = "io-fims.bootstrapper.prod.tfstate"
  }
}

provider "azurerm" {
  features {
  }
}

provider "github" {
  owner = "pagopa"
}
