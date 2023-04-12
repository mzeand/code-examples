data "aws_iam_policy_document" "ssm_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_instance_profile" "ssm_role" {
  name = "${var.project_name}-ssm-role"
  role = aws_iam_role.ssm_role.name
}

resource "aws_iam_role" "ssm_role" {
  name               = "${var.project_name}-ssm-role"
  assume_role_policy = data.aws_iam_policy_document.ssm_role.json
}

resource "aws_iam_role_policy_attachment" "ssm_role" {
  role       = aws_iam_role.ssm_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

data "aws_iam_policy_document" "ssm_additional_role" {
  statement {
    sid = "AllowSsmmessages"
    actions = [
      "ssm:UpdateInstanceInformation",
      "ssmmessages:CreateControlChannel",
      "ssmmessages:CreateDataChannel",
      "ssmmessages:OpenControlChannel",
      "ssmmessages:OpenDataChannel"
    ]
    resources = ["*"]
  }
  statement {
    sid = "AllowAccessEncryptedBucket"
    actions = [
      "s3:GetEncryptionConfiguration",
    ]
    resources = ["*"]
  }
}
resource "aws_iam_policy" "ssm_additional_role" {
  name   = "${var.project_name}-ssm-additional-role-policy"
  policy = data.aws_iam_policy_document.ssm_additional_role.json
}

resource "aws_iam_role_policy_attachment" "ssm_additional_role" {
  role       = aws_iam_role.ssm_role.name
  policy_arn = aws_iam_policy.ssm_additional_role.arn
}

# 最新のAMI ID
data aws_ssm_parameter amzn2_ami {
  name = "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2"
}

resource "aws_instance" "example" {
  ami                    = data.aws_ssm_parameter.amzn2_ami.value
  instance_type          = "t2.micro"
  iam_instance_profile   = aws_iam_instance_profile.ssm_role.name
  subnet_id              = module.vpc.private_subnets[0]
  vpc_security_group_ids = [aws_security_group.example.id]
  key_name               = module.instance_key_pair.key_pair_name

  tags = {
    Name = "${var.project_name}-instance"
  }
}

resource "aws_security_group" "example" {
  name        = "${var.project_name}-instance-sg"
  description = "allow ssm to example instance "
  vpc_id      = module.vpc.vpc_id
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-instance-sg"
  }
}
