locals {

  resource_group_name_common = "${var.project}-rg-common"

  node_version = "20-lts"
  app_cmd      = "node ."

  app_service_fims_oidc_provider = {
    app_settings_common = {
      # No downtime on slots swap
      WEBSITE_ADD_SITENAME_BINDINGS_IN_APPHOST_CONFIG = "1"
      WEBSITE_RUN_FROM_PACKAGE                        = "1"
      WEBSITE_DNS_SERVER                              = "168.63.129.16"
      PORT                                            = "3000"
      JWK_PRIMARY                                     = data.azurerm_key_vault_secret.jwk_primary_key_fims.value

      APPINSIGHTS_INSTRUMENTATIONKEY = data.azurerm_application_insights.application_insights.instrumentation_key

      // ENVIRONMENT
      NODE_ENV = "production"

      FETCH_KEEPALIVE_ENABLED = "true"
      // see https://github.com/MicrosoftDocs/azure-docs/issues/29600#issuecomment-607990556
      // and https://docs.microsoft.com/it-it/azure/app-service/app-service-web-nodejs-best-practices-and-troubleshoot-guide#scenarios-and-recommendationstroubleshooting
      // FETCH_KEEPALIVE_SOCKET_ACTIVE_TTL should not exceed 120000 (app service socket timeout)
      FETCH_KEEPALIVE_SOCKET_ACTIVE_TTL = "110000"
      // (FETCH_KEEPALIVE_MAX_SOCKETS * number_of_node_processes) should not exceed 160 (max sockets per VM)
      FETCH_KEEPALIVE_MAX_SOCKETS         = "128"
      FETCH_KEEPALIVE_MAX_FREE_SOCKETS    = "10"
      FETCH_KEEPALIVE_FREE_SOCKET_TIMEOUT = "30000"
      FETCH_KEEPALIVE_TIMEOUT             = "60000"

      EXPRESS_SERVER_HOSTNAME         = "0.0.0.0"
      LOG_LEVEL                       = "debug"
      APPLICATION_NAME                = "io-openid-provider"
      IO_BACKEND_BASE_URL             = "https://api-app.io.pagopa.it"
      VERSION                         = "0.0.1"
      COSMOSDB_NAME                   = "fims"
      COSMOSDB_URI                    = var.cosmos_db.endpoint
      COSMOSDB_KEY                    = var.cosmos_db.primary_key
      AUTHENTICATION_COOKIE_KEY       = "X-IO-FIMS-Token"
      GRANT_TTL_IN_SECONDS            = "86400"
      ISSUER                          = "https://io-p-fims-oidc-provider-app.azurewebsites.net"
      COOKIES_KEY                     = data.azurerm_key_vault_secret.cookies_key_fims.value
      ENABLE_FEATURE_REMEMBER_GRANT   = "true",
      APPINSIGHTS_SAMPLING_PERCENTAGE = 100,
      DEFAULT_REQUEST_TIMEOUT_MS      = 10000,
      ENABLE_PROXY                    = "true"
    }
  }

  app_service_openid_rp_example = {
    app_settings_common = {}
  }

  relying_party_func = {
    app_settings = {
      for s in var.rp_func.app_settings :
      s.name => s.key_vault_secret_name != null ? "@Microsoft.KeyVault(VaultName=${var.product}-kv;SecretName=${s.key_vault_secret_name})" : s.value
    }
    staging_disabled = []
  }

  openid_provider_func = {
    app_settings = {
      for s in var.op_func.app_settings :
      s.name => s.key_vault_secret_name != null ? "@Microsoft.KeyVault(VaultName=${var.product}-kv;SecretName=${s.key_vault_secret_name})" : s.value
    }
    staging_disabled = []
  }

  user_func = {
    app_settings = {
      for s in var.user_func.app_settings :
      s.name => s.key_vault_secret_name != null ? "@Microsoft.KeyVault(VaultName=${var.product}-kv;SecretName=${s.key_vault_secret_name})" : s.value
    }
    staging_disabled = []
  }
}
