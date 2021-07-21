import { App, Stack, StackProps } from '@aws-cdk/core';
import { getRHLambda } from './lambda';

export class JastmmStack extends Stack {

  constructor(scope: App, id: string, props: StackProps) {
    super(scope, id, props);

    const rhLambda = getRHLambda(this);

  }
}

