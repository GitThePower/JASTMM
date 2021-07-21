import { App, Stack } from '@aws-cdk/core';
import { JastmmStack } from '../lib';
import { expect as expectCDK, countResources } from '@aws-cdk/assert';

const app = new App();
let stack: Stack;

beforeAll(() => {
});

test('Stack Created', () => {
  stack = new JastmmStack(app, 'TestStack', {});
  
  expectCDK(stack).to(countResources("AWS::IAM::Role",2));
  expectCDK(stack).to(countResources("AWS::Lambda::Function",2));
});
