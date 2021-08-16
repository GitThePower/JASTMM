import { Construct, Duration } from '@aws-cdk/core';
import { Key } from '@aws-cdk/aws-kms';

export class KMS {
    public readonly key: Key

    constructor(scope: Construct, stackName: string) {

        this.key = new Key(scope, 'KMSKey', {
            alias: `alias/${stackName}`,
            enableKeyRotation: true,
            pendingWindow: Duration.days(10)
        });
    }
}