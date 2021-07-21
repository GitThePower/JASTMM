import { Construct } from '@aws-cdk/core'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { config } from '../config';
import { RetentionDays } from '@aws-cdk/aws-logs';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Runtime } from '@aws-cdk/aws-lambda';

export const getRHLambda = (scope: Construct) => {
    const rhLambdaRole = new Role(scope, 'JastmmRHLambdaRole', {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
        roleName: `${config.appName}-rh-lambda-role`
    });

    return new NodejsFunction(scope, 'JastmmRHLambda', {
        depsLockFilePath: 'package-lock.json',
        entry: 'lambdas/rh/index.js',
        functionName: `${config.appName}-rh-lambda`,
        handler: 'handler',
        logRetention: RetentionDays.ONE_DAY,
        memorySize: 128,
        retryAttempts: 0,
        role: rhLambdaRole,
        runtime: Runtime.NODEJS_14_X
    });
}