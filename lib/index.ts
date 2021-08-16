import { App, Stack, StackProps } from '@aws-cdk/core';
import { AccountRootPrincipal } from '@aws-cdk/aws-iam';
import * as kms from './kms';
import * as lambda from './lambda';

interface JastmmStackProps extends StackProps {
  stackName: string
}

export class JastmmStack extends Stack {

  constructor(scope: App, id: string, props: JastmmStackProps) {
    super(scope, id);

    const KMS = new kms.KMS(this, props.stackName);

    KMS.key.grantEncrypt(new AccountRootPrincipal());

    const rhLambda = lambda.getRHLambda(this, props.stackName, KMS.key);
    KMS.key.grantDecrypt(rhLambda);

  }
}

