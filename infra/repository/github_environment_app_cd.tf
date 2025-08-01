resource "github_repository_environment" "github_repository_environment_app_prod_cd" {
  environment = "app-prod-cd"
  repository  = local.repository.name

  reviewers {
    teams = matchkeys(
      data.github_organization_teams.all.teams[*].id,
      data.github_organization_teams.all.teams[*].slug,
      local.app_cd.reviewers_teams
    )
  }

  deployment_branch_policy {
    protected_branches     = false
    custom_branch_policies = true
  }
}

resource "github_actions_environment_secret" "env_app_prod_cd_secrets" {
  for_each = local.app_cd.secrets

  repository      = local.repository.name
  environment     = github_repository_environment.github_repository_environment_app_prod_cd.environment
  secret_name     = each.key
  plaintext_value = each.value
}
