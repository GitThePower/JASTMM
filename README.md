# This Repository is Archived!
Moving this project to AWS-Codecommit and will no longer be uploading changes to github

# JASTMM
Just another scheme to make money (legally through the power of investing!).

# Setup

## Install the AWS CLI

https://aws.amazon.com/cli/

## Private Credentials

Make a local-config/ directory at the root of this project to store private credentials.

# Commands

 * `npm run build`: creates a build from your typescript files
 * `npm run cleanup`: deletes all the files created by `npm run build`
 * `npm run deploy`: builds and deploys the project and cleans up the build files afterward (REQUIRED: valid user configuration in aws cli)
 * `npm t`: creates a build, runs unit tests, and cleans up the build files afterward
 * `npm run test-one [TEST-FILE]`: tests the test file passed as an argument


 
