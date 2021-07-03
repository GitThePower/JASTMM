import { App, Stack } from '@aws-cdk/core';
import { Jastmm } from '../lib';
import { expect as expectCDK, countResources } from '@aws-cdk/assert';

const app = new App();
let stack: Stack;

beforeAll(() => {
});

test('SNS Topic Created', () => {
  stack = new Jastmm(app, 'TestStack')
  
  expectCDK(stack).to(countResources("AWS::SNS::Topic",0));
});
