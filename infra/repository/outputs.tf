output "environment_prod" {
  value = {
    ci     = github_repository_environment.github_repository_environment_prod_ci.environment
    cd     = github_repository_environment.github_repository_environment_prod_cd.environment
    app-cd = github_repository_environment.github_repository_environment_app_prod_cd.environment
  }
}
