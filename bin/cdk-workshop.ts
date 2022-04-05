#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkWorkshopStack } from '../lib/cdk-workshop-stack';

const app = new cdk.App();
new CdkWorkshopStack(app, 'CdkWorkshopStack');

// CDK stacks are one to one equivalent to AWS CloudFormation stacks.
// And app can have multiple stacks.
// In this case, we have only one stack, the CdkWorkshopStack.