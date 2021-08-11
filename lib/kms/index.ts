import { Construct, Duration } from '@aws-cdk/core';
import { Key } from '@aws-cdk/aws-kms';
import * as AWS from 'aws-sdk'

export class KMS {
    public readonly key: Key

    constructor(scope: Construct, stackName: string) {
        this.key = new Key(scope, 'JastmmKey', {
            alias: `alias/${stackName}`,
            enableKeyRotation: true,
            pendingWindow: Duration.days(10)
        });
    }

    encrypt = async (value: string) => {
        const kmsClient = new AWS.KMS();
        const params = {
            KeyId: this.key.keyArn,
            Plaintext: Buffer.from(value)
        }

        const encryptedValue = await kmsClient.encrypt(params).promise();

        if (Buffer.isBuffer(encryptedValue.CiphertextBlob)) {
            return Buffer.from(encryptedValue.CiphertextBlob).toString('base64');
        } else {
            throw new Error('Could not encrypt value.');
        }
    }
}