#!/usr/bin/env node
import 'source-map-support/register';
import { App } from '@aws-cdk/core';
import { config } from '../local-config';
import { JastmmStack } from '../lib';

const app = new App();
const { awsAccountNumber, awsRegion, ...jastmmStackProps } = config;

new JastmmStack(app, 'JastmmStack', {
  env: { account: awsAccountNumber, region: awsRegion},
  ...jastmmStackProps
});
