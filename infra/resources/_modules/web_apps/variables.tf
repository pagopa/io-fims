# --- start legacy ---
variable "product" {
  type = string
}

variable "project_legacy" {
  type = string
}

variable "resource_group_name_legacy" {
  type = string
}

variable "subnet_id" {
  type = string
}
# --- end legacy ---

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

variable "virtual_network" {
  type = object({
    name                = string
    resource_group_name = string
  })
}

variable "subnet_pep_id" {
  type = string
}

variable "subnet_cidrs" {
  type = object({
    op_app     = string
    rp_example = string
  })
}

variable "key_vault" {
  type = object({
    id   = string
    name = string
  })
}

variable "cosmosdb_account" {
  type = object({
    name                = string
    resource_group_name = string
  })
}

variable "redis_cache" {
  type = object({
    id         = string
    url        = string
    access_key = string
  })
}


