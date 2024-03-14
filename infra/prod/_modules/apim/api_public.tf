module "apim_product_fims_public" {
  source = "github.com/pagopa/terraform-azurerm-v3.git//api_management_product?ref=v7.67.1"

  product_id          = "fims-public-api"
  api_management_name = data.azurerm_api_management.apim_v2_api.name
  resource_group_name = data.azurerm_api_management.apim_v2_api.resource_group_name

  display_name          = "FIMS PUBLIC API"
  description           = "PUBLIC API for FIMS openid provider."
  subscription_required = false
  approval_required     = false
  published             = true

  policy_xml = file("${path.module}/apis/public/_product_base_policy.xml")
}

module "apim_api_fims_public" {
  source = "github.com/pagopa/terraform-azurerm-v3//api_management_api?ref=v7.67.1"

  name                = "fims-public-api"
  api_management_name = data.azurerm_api_management.apim_v2_api.name
  resource_group_name = data.azurerm_api_management.apim_v2_api.resource_group_name

  revision     = "1"
  display_name = "FIMS PUBLIC API"
  description  = "PUBLIC API for FIMS."

  path        = "fims"
  protocols   = ["https"]
  product_ids = [module.apim_product_fims_public.product_id]

  service_url = format("https://%s", var.app_service_oicd_provider_hostname)

  subscription_required = false

  content_format = "swagger-json"
  content_value = templatefile("${path.module}/apis/public/_swagger.json.tpl",
    {
      host = "api-app.internal.io.pagopa.it"
    }
  )

  xml_content = file("${path.module}/apis/public/_base_policy.xml")
}
