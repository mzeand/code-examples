import {
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_ecs_patterns as ecsPatterns,
  aws_elasticloadbalancingv2 as elbv2,
  Stack,
  StackProps,
  Tags,
} from "aws-cdk-lib"
import { Construct } from 'constructs'

export class SimpleapiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    Tags.of(this).add("Environment", "sandbox", { priority: 300 })
    Tags.of(this).add("Product", "CDKSandbox", { priority: 300 })
    Tags.of(this).add("Owner", "MizueAndo", { priority: 300 })
    Tags.of(this).add("CostCenter", "MizueAndo", { priority: 300 })

    const namePrefix = "mizueando-cdk-sandbox"

    const vpc = new ec2.Vpc(this, `Vpc`, {
      vpcName: `${namePrefix}-vpc`
    })

    const cluster = new ecs.Cluster(this, `EcsCluster`, { vpc })

    const albSecurityGroup = new ec2.SecurityGroup(this, "AlbSecurityGroup", {
      vpc: vpc,
      allowAllOutbound: true,
    })
    albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "API client to ALB"
    )
    const alb = new elbv2.ApplicationLoadBalancer(this, 'Alb', {
      internetFacing: true,
      loadBalancerName: `${namePrefix}-alb`,
      securityGroup: albSecurityGroup,
      vpc
    })

    const taskDefinition = new ecs.FargateTaskDefinition(this, `TaskDefinition`, {
      family: `${namePrefix}-api-service`,
    })
    taskDefinition.addContainer("api", {
      portMappings: [
        { containerPort: 80, protocol: ecs.Protocol.TCP }
      ],
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      memoryLimitMiB: 512,
      cpu: 256,
      environment: {
        ENV: "sandbox",
        FOO: "foo1",
      },
    })

    const ecsSecurityGroup = new ec2.SecurityGroup(this, "ecsSecurityGroup", {
      vpc: vpc,
      allowAllOutbound: true,
    })
    ecsSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "ALB to ECS"
    )
    const albService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, `FargateAlbService`, {
      serviceName: `${namePrefix}-api-service`,
      cluster: cluster,
      taskSubnets: vpc,
      securityGroups: [ecsSecurityGroup],
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
      cpu: 256,
      memoryLimitMiB: 512,
      taskDefinition: taskDefinition,
      desiredCount: 2,
      enableECSManagedTags: true,
      circuitBreaker: { rollback: true },
      publicLoadBalancer: true,
      openListener: false,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetProtocol: elbv2.ApplicationProtocol.HTTP,
      protocolVersion: elbv2.ApplicationProtocolVersion.HTTP1,
      loadBalancer: alb,
    })
    albService.targetGroup.setAttribute(
      "deregistration_delay.timeout_seconds",
      "10"
    )

    // Overwrite the ecs service with current task definition revision
    const thisEcsService = albService.service.node.findChild("Service") as ecs.CfnService
    thisEcsService.taskDefinition = "arn:aws:ecs:ap-northeast-1:809036412434:task-definition/mizueando-cdk-sandbox-api-service:8"
  }
}
