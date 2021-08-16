#!/usr/bin/env node
import 'source-map-support/register';
import { App } from '@aws-cdk/core';
import { config } from '../local-config';
import { JastmmStack } from '../lib';

const app = new App();

new JastmmStack(app, 'JastmmStack', {
  env: { account: config.awsAccountNumber, region: config.awsRegion},
  stackName: config.stackName
});
