module "federated_identities" {
  source = "github.com/pagopa/dx//infra/modules/azure_federated_identity_with_github?ref=main"

  prefix    = local.prefix
  env_short = local.env_short
  env       = local.env
  domain    = local.domain

  repositories = [local.repo_name]

  continuos_integration = {
    enable = true
    roles = {
      subscription = [
        "Reader",
        "Reader and Data Access",
        "PagoPA IaC Reader"
      ]
      resource_groups = {
        terraform-state-rg = [
          "Storage Blob Data Contributor"
        ]
        io-p-fims-rg = [
          "DocumentDB Account Contributor",
          "Key Vault Certificate User"
        ],
        io-p-weu-fims-rg-01 = [
          "DocumentDB Account Contributor",
          "Key Vault Certificate User"
        ],
        io-p-itn-fims-rg-01 = [
          "DocumentDB Account Contributor",
          "Key Vault Certificate User"
        ]
      }
    }
  }

  continuos_delivery = {
    enable = true
    roles = {
      subscription = [
        "Contributor"
      ]
      resource_groups = {
        terraform-state-rg = [
          "Storage Blob Data Contributor"
        ]
        io-p-fims-rg = [
          "Role Based Access Control Administrator"
        ],
        io-p-weu-fims-rg-01 = [
          "Role Based Access Control Administrator"
        ],
        "io-p-itn-fims-rg-01" = [
          "Role Based Access Control Administrator"
        ]
      }
    }
  }

  tags = local.tags
}
