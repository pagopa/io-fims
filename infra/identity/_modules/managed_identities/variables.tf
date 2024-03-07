variable "domain" {
  type        = string
  description = "IO domain name"
}

variable "prefix" {
  type        = string
  description = "IO short prefix"
}

variable "env_short" {
  type        = string
  description = "Short environment"
}

variable "tags" {
  type        = map(any)
  description = "Resources tags"
}
