resource "azurerm_resource_group" "fims" {
  name     = "${var.project_legacy}-rg"
  location = var.location

  tags = var.tags
}

resource "azurerm_resource_group" "fims_01" {
  name     = "${var.project}-rg-01"
  location = var.location

  tags = var.tags
}
