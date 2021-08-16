# JASTMM
Just another scheme to make money (legally through the power of investing!).

# Setup

## Install AWS CDK

 * Run `npm i -g aws-cdk@1.118.0`
 * Verify Successful installation by running `npm ls -g --depth 0` and checking for `aws-cdk@1.118.0`

## Install the AWS CLI

https://aws.amazon.com/cli/

## Private Credentials

Make a local-config/ directory at the root of this project to store private credentials.

# Deploying to AWS

 * `npm run build`
 * `cdk synth`
 * `cdk deploy`
