resource "azurerm_resource_group" "fims" {
  name     = "${var.project}-fims-rg"
  location = var.location

  tags = var.tags
}
