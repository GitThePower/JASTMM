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

test('Jastmm Stack should create S3 Bucket', () => {
    expectCDK(stack).to(
        haveResourceLike('AWS::S3::Bucket', {
            BucketName: `${stackName}-s3-bucket`,
            BucketEncryption: {
                ServerSideEncryptionConfiguration: [
                    {
                    ServerSideEncryptionByDefault: {
                        KMSMasterKeyID: {
                        'Fn::GetAtt': [
                            'KMSKeyBD866E3F',
                            'Arn'
                        ]
                        },
                        SSEAlgorithm: 'aws:kms'
                    }
                    }
                ]
            },
            LifecycleConfiguration: {
                Rules: [
                    {
                    ExpirationInDays: 90,
                    Status: 'Enabled',
                    Transitions: [
                        {
                        StorageClass: 'ONEZONE_IA',
                        TransitionInDays: 0
                        }
                    ]
                    }
                ]
            },
            PublicAccessBlockConfiguration: {
                BlockPublicAcls: true,
                BlockPublicPolicy: true,
                IgnorePublicAcls: true,
                RestrictPublicBuckets: true
            }
        })
    )
});