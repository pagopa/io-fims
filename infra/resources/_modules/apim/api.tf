resource "azurerm_api_management_api_version_set" "fims_v1" {
  name                = "fims_appbackend_v1"
  resource_group_name = data.azurerm_api_management.apim_itn_platform_api.resource_group_name
  api_management_name = data.azurerm_api_management.apim_itn_platform_api.name
  display_name        = "FIMS AppBackend v1"
  versioning_scheme   = "Segment"
}

resource "azurerm_api_management_api" "fims" {
  name                  = "io-p-fims-api"
  api_management_name   = data.azurerm_api_management.apim_itn_platform_api.name
  resource_group_name   = data.azurerm_api_management.apim_itn_platform_api.resource_group_name
  subscription_required = false

  version_set_id = azurerm_api_management_api_version_set.fims_v1.id
  version        = "v1"
  revision       = 1

  description  = "IO FIMS AppBackend API"
  display_name = "FIMS AppBackend"
  path         = "api/fims"
  protocols    = ["https"]

  import {
    content_format = "openapi-link"
    content_value  = "https://raw.githubusercontent.com/pagopa/io-backend/04671520b83cfaaab42821c7bd6b6f5bf6405b6c/openapi/generated/api_fims_platform.yaml"
  }
}

resource "azurerm_api_management_product_api" "io_fims" {
  api_name            = azurerm_api_management_api.fims.name
  resource_group_name = data.azurerm_api_management.apim_itn_platform_api.resource_group_name
  api_management_name = data.azurerm_api_management.apim_itn_platform_api.name
  product_id          = data.azurerm_api_management_product.apim_itn_product_io_auth.product_id
}

resource "azurerm_api_management_api_policy" "io_fims_base" {
  api_name            = azurerm_api_management_api.fims.name
  api_management_name = data.azurerm_api_management.apim_itn_platform_api.name
  resource_group_name = data.azurerm_api_management.apim_itn_platform_api.resource_group_name

  xml_content = file("${path.module}/api/backend/_api_base_policy.xml")
  depends_on  = [azurerm_api_management_named_value.app_backend_key]
}

resource "azurerm_api_management_api_tag" "io_fims_api_tag" {
  api_id = azurerm_api_management_api.fims.id
  name   = azurerm_api_management_tag.io_fims.name
}
