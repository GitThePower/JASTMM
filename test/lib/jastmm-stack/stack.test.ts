import { App, Stack } from '@aws-cdk/core';
import { JastmmStack } from '../../../lib/jastmm-stack';
import { expect as expectCDK, countResources } from '@aws-cdk/assert';

const app = new App();
let stack: Stack;

beforeAll(() => {
  stack = new JastmmStack(app, 'TestStack', {});
});

test('Stack Created', () => {
  expectCDK(stack).to(countResources("AWS::IAM::Role",1));
  expectCDK(stack).to(countResources("AWS::Lambda::Function",1));
});
