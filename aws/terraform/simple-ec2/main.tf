data "aws_caller_identity" "self" {}

resource "tls_private_key" "instance_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

module "instance_key_pair" {
  source  = "terraform-aws-modules/key-pair/aws"
  version = "2.0.2"

  key_name   = "${var.project_name}-instance-key"
  public_key = tls_private_key.instance_key.public_key_openssh
}

resource "aws_secretsmanager_secret" "instance_public_key" {
  name        = "${var.project_name}-instance-public-key"
  description = "ssh public key for instance"
}

resource "aws_secretsmanager_secret_version" "instance_public_key" {
  secret_id     = aws_secretsmanager_secret.instance_public_key.id
  secret_string = tls_private_key.instance_key.public_key_openssh
}

resource "aws_secretsmanager_secret" "instance_private_key" {
  name        = "${var.project_name}-instance-private-key"
  description = "ssh private key for instance"
}

resource "aws_secretsmanager_secret_version" "instance_private_key" {
  secret_id     = aws_secretsmanager_secret.instance_private_key.id
  secret_string = tls_private_key.instance_key.private_key_pem
}
