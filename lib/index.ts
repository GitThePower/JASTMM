import { App, Stack, StackProps } from '@aws-cdk/core';
import { Secret } from '@aws-cdk/aws-secretsmanager';
import { Effect, ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { Runtime } from '@aws-cdk/aws-lambda';
import { Topic } from '@aws-cdk/aws-sns';
import { LambdaSubscription } from '@aws-cdk/aws-sns-subscriptions';

interface JastmmStackProps extends StackProps {
  rhPassword: string;
  rhUsername: string;
  stackName: string;
}

export class JastmmStack extends Stack {

  constructor(scope: App, id: string, props: JastmmStackProps) {
    super(scope, id);

    // Credentials stored in AWS Secrets Manager
    const rhCreds = new Secret(this, 'JastmmRhSecrets', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          password: props.rhPassword,
          username: props.rhUsername
        }),
        generateStringKey: 'placeHolder',
      },
      secretName: 'rh-credentials'
    });

    // Role for Lambda Function
    const rhLambdaRole = new Role(this, 'JastmmRhLambdaRole', {
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

    // Lambda Function
    const rhLambda = new NodejsFunction(this, 'JastmmRhLambda', {
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

    // SNS Topic for receiving MFA texts
    const rhMfaTopic = new Topic(this, 'JastmmRhMfaTopic', {
      displayName: 'JastmmRhMfaTopic',
      topicName: `${props.stackName}-rh-mfa-topic`
    });
    rhMfaTopic.addToResourcePolicy(new PolicyStatement({
      actions: ['sns:Publish'],
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal('mobile.amazonaws.com')],
      resources: ['*']
    }))
    rhMfaTopic.addSubscription(new LambdaSubscription(rhLambda));
  }
}

