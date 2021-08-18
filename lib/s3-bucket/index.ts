import { Construct, Duration, RemovalPolicy } from "@aws-cdk/core";
import { BlockPublicAccess, Bucket, BucketEncryption, StorageClass } from "@aws-cdk/aws-s3";
import { IKey } from "@aws-cdk/aws-kms";

export const createS3Bucket = (scope: Construct, stackName: string, kmsKey: IKey) => new Bucket(scope, 'S3Bucket', {
    autoDeleteObjects: true,
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    bucketName: `${stackName}-s3-bucket`,
    encryption: BucketEncryption.KMS,
    encryptionKey: kmsKey,
    enforceSSL: true,
    lifecycleRules: [
        {
            expiration: Duration.days(90),
            transitions: [
                {
                    storageClass: StorageClass.ONE_ZONE_INFREQUENT_ACCESS,
                    transitionAfter: Duration.days(30)
                }
            ]
        }
    ],
    removalPolicy: RemovalPolicy.DESTROY
});