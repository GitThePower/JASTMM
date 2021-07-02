import * as cdk from '@aws-cdk/core';

export interface DeployProps {
  // Define construct properties here
}

export class Deploy extends cdk.Construct {

  constructor(scope: cdk.Construct, id: string, props: DeployProps = {}) {
    super(scope, id);

    // Define construct contents here
  }
}
