terraform {
  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "tfappprodio"
    container_name       = "terraform-state"
    key                  = "local.repository.name.repository.bootstrapper.prod.tfstate"
  }
}

provider "github" {
  owner = "pagopa"
}
