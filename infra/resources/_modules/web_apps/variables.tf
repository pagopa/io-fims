variable "resource_group_name" {
  type = string
}

variable "environment" {
  type = object({
    prefix    = string
    env_short = string
    location  = string
    domain    = string
  })
  description = "Values which are used to generate resource names and location short names."
}

variable "tags" {
  type = map(any)
}

variable "key_vault" {
  type = object({
    id        = string
    name      = string
    vault_uri = string
  })
}
