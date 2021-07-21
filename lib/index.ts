import { App, Stack } from '@aws-cdk/core';
import { getRHLambda } from './lambda';

export class Jastmm extends Stack {

  constructor(scope: App, id: string) {
    super(scope, id);

    const rhLambda = getRHLambda(this);

  }
}

