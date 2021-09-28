import { App, Stack } from '@aws-cdk/core';
import { JastmmStack } from '../../lib';
import { expect as expectCDK, countResources } from '@aws-cdk/assert';

const app = new App();
const stackName = 'jastmm';
let stack: Stack;

beforeAll(() => {
  stack = new JastmmStack(app, 'TestStack', {
    stackName
  });
});

test('Jastmm stack should create resources', () => {
  expectCDK(stack).to(countResources("AWS::IAM::Policy", 1));
  expectCDK(stack).to(countResources("AWS::IAM::Role", 1));
  expectCDK(stack).to(countResources("AWS::Lambda::Function", 1));
});
