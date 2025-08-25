resource "github_repository" "io_fims" {
  name = local.repository.name
  description = "This is the repository that contains all the funcftionalities regarding FIMS"
  visibility = "public"

  allow_auto_merge   = true
  allow_rebase_merge = false
  allow_merge_commit = false
  allow_squash_merge = true
  allow_update_branch = true

  delete_branch_on_merge = true

  has_projects    = false
  has_wiki        = false
  has_discussions = false
  has_issues      = false
  has_downloads   = false

  vulnerability_alerts = true

  archive_on_destroy = true

  squash_merge_commit_message = "PR_BODY"
  squash_merge_commit_title   = "PR_TITLE"
}
