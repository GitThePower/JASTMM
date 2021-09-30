import { App, Stack, StackProps } from '@aws-cdk/core';
import { Secret } from '@aws-cdk/aws-secretsmanager';
import { Effect, ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { Runtime } from '@aws-cdk/aws-lambda';

interface JastmmStackProps extends StackProps {
  rhPassword: string;
  rhUsername: string;
  stackName: string;
}

export class JastmmStack extends Stack {

  constructor(scope: App, id: string, props: JastmmStackProps) {
    super(scope, id);

    // Store credentials in AWS Secrets Manager
    const rhCreds = new Secret(this, 'JastmmRHSecrets', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          password: props.rhPassword,
          username: props.rhUsername
        }),
        generateStringKey: 'placeHolder',
      },
      secretName: 'rh-credentials'
    });

    const universalDenyStatement = new PolicyStatement({
      actions: ['*'],
      effect: Effect.DENY,
      resources: ['*']
    });
    rhCreds.addToResourcePolicy(universalDenyStatement);

    // Create a Role for our Lambda
    const rhLambdaRole = new Role(this, 'JastmmRHLambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      roleName: `${props.stackName}-rh-lambda-role`
    });
    rhLambdaRole.addManagedPolicy(  // Add the Lambda Basic Execution Policy to the Role
      ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaBasicExecutionRole',
      ),
    );
    rhCreds.grantRead(rhLambdaRole);  // Grant the Role Access to read the credentials
    rhCreds.grantWrite(rhLambdaRole); // Grant the Role Access to update the credentials

    // Create the Lambda
    const rhLambda = new NodejsFunction(this, 'JastmmRHLambda', {
      depsLockFilePath: 'package-lock.json',
      entry: 'src/rh/index.js',
      environment: {
        RH_CREDENTIALS_ARN: rhCreds.secretArn
      },
      functionName: `${props.stackName}-rh-lambda`,
      handler: 'handler',
      memorySize: 128,
      retryAttempts: 0,
      role: rhLambdaRole,
      runtime: Runtime.NODEJS_14_X
    });
    universalDenyStatement.addCondition('ArnNotEquals', {
      'aws:SourceArn': rhLambda.functionArn
    })
  }
}

