module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.19.0"
 
  name = "${var.project_name}-vpc"
  cidr = "10.1.0.0/16"
 
  azs             = ["${var.region}a","${var.region}c"]
  public_subnets  = ["10.1.1.0/24","10.1.2.0/24"]
  private_subnets = ["10.1.10.0/24","10.1.20.0/24"]
 
  enable_dns_hostnames = true 
  enable_nat_gateway = true
}
