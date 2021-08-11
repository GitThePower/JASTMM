import { Construct } from '@aws-cdk/core'
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { Runtime } from '@aws-cdk/aws-lambda';

export const getRHLambda = (scope: Construct, stackName: string, environment: {[key: string]: string}) => {
    const rhLambdaRole = new Role(scope, 'JastmmRHLambdaRole', {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
        roleName: `${stackName}-rh-lambda-role`
    });

    return new NodejsFunction(scope, 'JastmmRHLambda', {
        depsLockFilePath: 'package-lock.json',
        entry: 'src/rh/index.js',
        environment,
        functionName: `${stackName}-rh-lambda`,
        handler: 'handler',
        memorySize: 128,
        retryAttempts: 0,
        role: rhLambdaRole,
        runtime: Runtime.NODEJS_14_X
    });
}