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
    user_func = string
  })
}

variable "key_vault_common" {
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

variable "storage" {
  type = object({
    id                  = string
    name                = string
    resource_group_name = string
    queues = object({
      config = object({
        name = string
      })
      access = object({
        name = string
      })
      export = object({
        name = string
      })
    })
  })
}

variable "application_insights" {
  type = object({
    connection_string = string
  })
}

variable "private_dns_zone_resource_group_name" {
  type = string
}
