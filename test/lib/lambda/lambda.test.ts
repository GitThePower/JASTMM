import { App, Stack } from '@aws-cdk/core';
import { JastmmStack } from '../../../lib';
import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';

const app = new App();
const stackName = 'jastmm';
let stack: Stack;

beforeAll(() => {
  stack = new JastmmStack(app, 'TestStack', {
    stackName
  });
});

test('Lambdas should have: RHLambda', () => {
    expectCDK(stack).to(
        haveResourceLike('AWS::Lambda::Function', {
            FunctionName: `${stackName}-rh-lambda`,
            Role: {
                'Fn::GetAtt': [
                  'JastmmRHLambdaRole419B85BB',
                  'Arn'
                ]
              },
              Environment: {
                Variables: {
                  AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
                  keyArn: {
                    'Fn::GetAtt': [
                      'KMSKeyBD866E3F',
                      'Arn'
                    ]
                  },
                }
              },
              Handler: 'index.handler',
              MemorySize: 128,
              Runtime: 'nodejs14.x'
        })
    )
});