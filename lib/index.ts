import { App, Stack, StackProps } from '@aws-cdk/core';
import { getKMSKey } from './kms';
import { getRHLambda } from './lambda';

const stackName = 'jastmm';

export class JastmmStack extends Stack {

  constructor(scope: App, id: string, props: StackProps) {
    super(scope, id, props);

    const key = getKMSKey(this, stackName);

    const rhUsername = 'dummyUser';
    const rhPassword = 'dummyPassword';

    const rhLambda = getRHLambda(this, stackName, rhUsername, rhPassword, key);
    key.grantDecrypt(rhLambda);

  }
}

