# YOYO Lunchbox
This application is written in React Native to help run on both Android and iOS. It uses Expo to build,
publish and maintain the application's javascript bundles.

We have 2 channels - production and beta. Production is of course the channel that is used for our customers
and beta is used for testing purposes. For any code changes related to beta, please use the beta branch.

## Tech Stack
- AWS Cognito - for user management
- AWS Lambda - for all backend APIs (all node js functions)
- AWS API Gateway - for managing endpoints to AWS Lambda. These are authenticated using cognito user token
- AWS RDS - our postgres database resides here
- AWS S3 - for storing food images
- AWS Amplify - used for connecting to cognito from react native
- Serverless - used for managing lambda functions
- React Native - for android and ios development
- Expo - for managing javascript bundles

## Development environment setup
- Git pull the code base and open it up in VS Code or any other editor of choice
- Install the AWS CLI and setup your credentials (Talk to @ssrva for credentials)
- Install the amplify CLI
    - `npm install -g @aws-amplify/cli`
    - `amplify configure`
    - `amplify env pull` and pull the prod env
- Download nad install serverless CLI
    - All lambda functions reside at `./aws/lambda/aws-postgres-server`
    - `serverless-offline` will start the local backend server
    - `serverless deploy --stage beta` will push lambda functions to beta
    - `serverless deploy --stage production` will push lambda functions to prod
- Download and install Expo CLI for local testing
    - `expo start` will start the local metro server. Scan the QR code from the popup to run the app on your phone
    - `expo publish --release-channel beta` for publishing to beta
    - `expo publish --release-channel production` for publishing to prod. (NOTE - This will push directly to production customer's phones. Be careful while running this).
    - `expo build:android --release-channel production` or `expo build:ios --release-channel production` to build bundles for android or ios. This is needed to publish updates to the respective stores.
    - `expo build:android -t apk --release-channel production` to build an APK file.

- To build local debug apk follow the steps below
    - Run this command to generate JS bundle used in debug apk `npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`
    - Make sure you create assets folder in `android/app/src/main/` before running above command
    - cd into android folder and run `./gradlew assembleDebug` to generate the APK.
    - Generated apk can be found in `android/app/build/outputs/apk`
