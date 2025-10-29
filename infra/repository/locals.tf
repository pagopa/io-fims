locals {
  repository = {
    name                     = "io-fims"
    description              = "This is the repository that contains all the funcftionalities regarding FIMS"
    topics                   = ["backend", "io", "comunicazione", "iocom"]
    reviewers_teams          = ["io-communication-backend", "engineering-team-cloud-eng"]
    default_branch_name      = "main"
    infra_cd_policy_branches = ["main"]
    opex_cd_policy_branches  = ["main"]
    app_cd_policy_branches   = ["main"]
    app_cd_policy_tags       = ["*@*"]
  }
}
