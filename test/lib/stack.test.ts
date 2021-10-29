import { App, Stack } from '@aws-cdk/core';
import { JastmmStack } from '../../lib';
import { expect as expectCDK, countResources } from '@aws-cdk/assert';

const app = new App();
let stack: Stack;

beforeAll(() => {
  const jastmmStackProps = {
    env: { account: '123456789012', region: 'us-east-1'},
    rhPassword: 'somePassword',
    rhUsername: 'someUsername',
    stackName: 'jastmm',
    userArn: 'someArn'
  }
  stack = new JastmmStack(app, 'TestStack', jastmmStackProps);
});

test('Jastmm stack should create resources', () => {
  expectCDK(stack).to(countResources("AWS::IAM::Policy", 1));
  expectCDK(stack).to(countResources("AWS::IAM::Role", 1));
  expectCDK(stack).to(countResources("AWS::Lambda::EventInvokeConfig", 1));
  expectCDK(stack).to(countResources("AWS::Lambda::Function", 1));
  expectCDK(stack).to(countResources("AWS::Lambda::Permission", 1));
  expectCDK(stack).to(countResources("AWS::SNS::Subscription", 1));
  expectCDK(stack).to(countResources("AWS::SNS::Topic", 1));
  expectCDK(stack).to(countResources("AWS::SNS::TopicPolicy", 1));
  expectCDK(stack).to(countResources("AWS::SecretsManager::Secret", 1));
});
