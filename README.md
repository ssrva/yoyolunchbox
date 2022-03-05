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
    - Run this command to generate the initial JS bundle to use `npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`
    - Make sure you create assets folder in `android/app/src/main/` before running above command
    - Delete `android/app/src/main/res/drawable-*` and `raw` folder inside it.
    - cd into android folder and run `./gradlew assembleDebug` to generate the APK.
    - Generated apk can be found in `android/app/build/outputs/apk`

- To build a signed bundle
    - Run `expo fetch:android:keystore` to get the key file from expo.
    - Copy the keystore file to 'android/app'.
    - Update the keystore credentials into build.gradle file under signingConfigs.release section.
    - Run `./gradlew bundleRelease` from inside android folder to generate aab file to upload to playstore.
    - If you're facing `Duplicate Resource` issue while building, delete `drawable-*` and `raw` folders from `android/app/src/main/res`
    - Run `./gradlew assembleRelease` to generate a signed apk.

iOS development guide

1. Instal cocoapods on your mac - `brew install cocoapods`
2. Run `sudo xcode-select --switch /Applications/Xcode.app`
3. cd into `ios` folder and run `pod install` to install the pods

iOS Testing app through test flight
TestFlight on iOS does not allow to have a separate build for testing. The idea is to have the same build as production to be used by testers too.
In our use case we want to use a differente expo release channel for test flight builds. Here is the workaround

1. Open Xcode, go to YOYOLunchbox > Supporting > Expo.
2. Update EXUpdatesReleaseChannel variable to `beta`
3. Go to Product > Archive
4. Upload the archive to app store connect.
5. Once the upload is done, the build should be visible on TestFlight app.
6. Once all the testing is completed build another archive by switching back EXUpdatesReleaseChannel to production
7. Upload to app store connect and make a release.

