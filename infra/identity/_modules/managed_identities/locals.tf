locals {
  repository = "io-fims"

  ci_github_federations = [
    {
      repository = local.repository,
      subject    = "prod-ci"
    }
  ]

  cd_github_federations = [
    {
      repository = local.repository,
      subject    = "prod-cd"
    }
  ]

  environment_ci_roles = {
    subscription = [
      "Reader",
      "Reader and Data Access"
    ]
    resource_groups = {
      terraform-state-rg = [
        "Storage Blob Data Contributor"
      ]
      io-p-fims-rg = [
        "DocumentDB Account Contributor"
      ]
    }
  }

  environment_cd_roles = {
    subscription = [
      "Contributor"
    ]
    resource_groups = {
      terraform-state-rg = [
        "Storage Blob Data Contributor"
      ]
    }
  }
}
