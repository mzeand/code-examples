terraform {
  required_version = ">= 1.3.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.21"
    }
  }
}

provider "aws" {
  region = var.region
  default_tags {
    tags = {
      Environment = "example"
      CostCenter  = "example-code"
      Project = var.project_name
      Owner = var.owner
      Terraform   = "true"
    }
  }
}
