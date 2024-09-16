import { Stack, StackProps, CfnOutput, Aws } from 'aws-cdk-lib';
import {
  aws_iam as iam,
  aws_s3 as s3,
  aws_lambda as lambda,
  aws_s3objectlambda as s3ObjectLambda,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class ExampleLambda01Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const resourceName = 'example-lambda01';

    const bucket = new s3.Bucket(this, `ExampleLambda01Bucket`, {
      bucketName: `${resourceName}-bucket`,
      accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    const lambdaRole = new iam.Role(this, `ExampleLambda01Role`, {
      roleName: `${resourceName}-role`,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

  }
}
