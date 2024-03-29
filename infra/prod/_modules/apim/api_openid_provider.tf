module "apim_product_fims_openid_provider" {
  source = "github.com/pagopa/terraform-azurerm-v3.git//api_management_product?ref=v7.67.1"

  product_id          = "io-fims-openid-provider-api"
  api_management_name = data.azurerm_api_management.apim_v2_api.name
  resource_group_name = data.azurerm_api_management.apim_v2_api.resource_group_name

  display_name          = "IO FIMS OpenId Provider API"
  description           = "Product for FIMS OpenId Provider APIs."
  subscription_required = false
  approval_required     = false
  published             = true

  policy_xml = file("${path.module}/apis/openid-provider/_product_base_policy.xml")
}

module "apim_api_fims_openid_provider" {
  source = "github.com/pagopa/terraform-azurerm-v3//api_management_api?ref=v7.67.1"

  name                = "io-fims-openid-provider-api"
  api_management_name = data.azurerm_api_management.apim_v2_api.name
  resource_group_name = data.azurerm_api_management.apim_v2_api.resource_group_name

  revision     = "1"
  display_name = "IO FIMS OPENID PROVIDER"
  description  = "Public API for FIMS OpenId Provider."

  path        = "fims"
  protocols   = ["https"]
  product_ids = [module.apim_product_fims_openid_provider.product_id]

  service_url = format("https://%s", var.app_service_oicd_provider_hostname)

  subscription_required = false

  content_format = "swagger-json"
  content_value = templatefile("${path.module}/apis/openid-provider/_swagger.json.tpl",
    {
      host = "api-app.internal.io.pagopa.it"
    }
  )

  xml_content = file("${path.module}/apis/openid-provider/_base_policy.xml")
}
