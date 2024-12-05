#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LambrollExampleStack } from '../lib/lambroll-example-stack';

const app = new cdk.App();
new LambrollExampleStack(app, 'LambrollStack');
