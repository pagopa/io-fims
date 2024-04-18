resource "azurerm_resource_group" "fims" {
  name     = "${var.product}-rg"
  location = var.location

  tags = var.tags
}
