import { Construct } from '@aws-cdk/core'
import { IKey } from '@aws-cdk/aws-kms'
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { Runtime } from '@aws-cdk/aws-lambda';

export const getRHLambda = (scope: Construct, stackName: string, rhUsername: string, rhPassword: string, kmsKey: IKey) => {
    const rhLambdaRole = new Role(scope, 'JastmmRHLambdaRole', {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
        roleName: `${stackName}-rh-lambda-role`
    });

    return new NodejsFunction(scope, 'JastmmRHLambda', {
        depsLockFilePath: 'package-lock.json',
        entry: 'lambdas/rh/index.js',
        environment: {
            RH_PASSWORD: rhPassword,
            RH_USERNAME: rhUsername
        },
        environmentEncryption: kmsKey,
        functionName: `${stackName}-rh-lambda`,
        handler: 'handler',
        memorySize: 128,
        retryAttempts: 0,
        role: rhLambdaRole,
        runtime: Runtime.NODEJS_14_X
    });
}