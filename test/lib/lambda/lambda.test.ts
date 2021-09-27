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

test('Jastmm stack should create RHLambda', () => {
  expectCDK(stack).to(
    haveResourceLike('AWS::Lambda::Function', {
      FunctionName: `${stackName}-rh-lambda`,
      Environment: {
        Variables: {
          AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
          KMS_KEY: {
            'Fn::GetAtt': [
              'KMSKeyBD866E3F',
              'Arn'
            ]
          },
          S3_BUCKET: {
            Ref: 'S3Bucket07682993'
          },
        }
      },
      Handler: 'index.handler',
    })
  )
});