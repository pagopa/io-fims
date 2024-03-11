resource "github_repository_environment" "github_repository_environment_prod_cd" {
  environment = "prod-cd"
  repository  = local.repository

  reviewers {
    teams = matchkeys(
      data.github_organization_teams.all.teams[*].id,
      data.github_organization_teams.all.teams[*].slug,
      local.cd.reviewers_teams
    )
  }

  deployment_branch_policy {
    protected_branches     = false
    custom_branch_policies = true
  }
}

resource "github_actions_environment_secret" "env_prod_cd_secrets" {
  for_each = local.cd.secrets

  repository      = local.repository
  environment     = github_repository_environment.github_repository_environment_prod_cd.environment
  secret_name     = each.key
  plaintext_value = each.value
}
