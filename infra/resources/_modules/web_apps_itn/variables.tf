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
    op_app    = string
    op_func   = string
    user_func = string
  })
}

variable "key_vault" {
  type = object({
    id        = string
    name      = string
    vault_uri = string
  })
}

variable "cosmosdb_account_itn" {
  type = object({
    name                = string
    resource_group_name = string
  })
}


variable "storage_itn" {
  type = object({
    id                  = string
    name                = string
    resource_group_name = string
    queues = object({
      audit_events = object({
        name = string
      })
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

variable "audit_storage" {
  type = object({
    id                  = string
    name                = string
    resource_group_name = string
    containers = object({
      events = object({
        name = string
      })
    })
  })
}

variable "redis_cache" {
  type = object({
    id                 = string
    hostname           = string
    primary_access_key = string
    ssl_port           = string
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
