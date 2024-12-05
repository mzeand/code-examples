import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as Lambroll from '../lib/lambroll-example-stack';

test('SQS Queue and SNS Topic Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Lambroll.LambrollExampleStack(app, 'MyTestStack');
  // THEN

  const template = Template.fromStack(stack);

});
