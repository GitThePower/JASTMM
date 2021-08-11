import { App, Stack } from '@aws-cdk/core';
import { JastmmStack } from '../../../../lib/jastmm-stack';
import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';

const app = new App();
let stack: Stack;
let stackName: string;

beforeAll(() => {
    stack = new JastmmStack(app, 'TestStack', {});
    stackName = 'jastmm';
})

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
                  RH_USERNAME: 'dummyUser',
                  RH_PASSWORD: 'dummyPassword'
                }
              },
              Handler: 'index.handler',
              MemorySize: 128,
              Runtime: 'nodejs14.x'
        })
    )
});