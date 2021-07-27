import { Construct, Duration } from '@aws-cdk/core';
import { Key } from '@aws-cdk/aws-kms';

export const getKMSKey = (scope: Construct, stackName: string) => {
    return new Key(scope, 'JastmmKey', {
        alias: `alias/${stackName}`,
        enableKeyRotation: true,
        pendingWindow: Duration.days(10)
    });
}