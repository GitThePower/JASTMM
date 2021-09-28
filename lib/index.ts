import { App, Stack, StackProps } from '@aws-cdk/core';
import * as lambda from './lambda';

interface JastmmStackProps extends StackProps {
  stackName: string
}

export class JastmmStack extends Stack {

  constructor(scope: App, id: string, props: JastmmStackProps) {
    super(scope, id);

    const rhLambda = lambda.getRHLambda(this, props.stackName);

  }
}

