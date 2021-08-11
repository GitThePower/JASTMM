import { App, Stack, StackProps } from '@aws-cdk/core';
import { KMS } from '../kms-stack';
import { AccountRootPrincipal } from '@aws-cdk/aws-iam';
import { getRHLambda } from './lambda';

const stackName = 'jastmm';

export class JastmmStack extends Stack {

  constructor(scope: App, id: string, props: StackProps) {
    super(scope, id, props);

    const kms = new KMS(this, stackName);
    kms.key.grantEncrypt(new AccountRootPrincipal());

    const rhEnvironment = {
      RH_USERNAME: 'dummyUser',
      RH_PASSWORD: 'dummyPassword',
    }
    const rhLambda = getRHLambda(this, stackName, rhEnvironment);
    kms.key.grantDecrypt(rhLambda);

  }
}

