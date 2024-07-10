<div align="center">
<img src="https://github.com/AmityCo/Amity-Social-UIKit-React-Native-OpenSource/assets/112688936/ddeeef20-2dfa-449e-bd3d-62238d7c9be0" width="160" >
<img src="https://github.com/AmityCo/Amity-Social-UIKit-React-Native-OpenSource/assets/112688936/e6b2d2a2-5158-429e-b1af-ea679b14fc11" width="150">
<h1>Amity Ui-Kit for React native open-source (Native modules)</h1>
  ** This is the beta version. The repo will be updated frequently. Please keep in touch **
</div>
<div align="center">
 <img width="250" alt="Screenshot_2566-07-24_at_19 16 20-removebg-preview" src="https://github.com/AmityCo/Amity-Social-UIKit-React-Native-OpenSource/assets/112688936/ce60425f-b478-408b-88c3-341d00263760">
 <img width="286" alt="Screenshot_2566-07-24_at_19 16 20-removebg-preview" src="https://github.com/AmityCo/Amity-Social-UIKit-React-Native-OpenSource/assets/112688936/843d3dc7-094f-4e29-812b-9fc864a96c14">
</div>

## Getting started

Our AmityUIKit include user interfaces to enable fast integration of standard Amity Social features into new or existing applications. Furthermore, our React Native UIKit supports integration with **React Native CLI**, providing you with a flexible experience to seamlessly integrate social features into your existing React Native application.

#Minimum Requirements

- node 16
- JDK 17.0.10
- ruby 3.2.0
- XCode 15

### Try Sample app

This repository also includes a built-in sample app which you can use to test your code while customizing it, or even explore our UIKit features with just a few installations!

#### Run sample app with Native module

Use yarn

1. Install packages

```
cd example
```

```
yarn
```

2. Sample app is using firebase push notification. you need to setup firebase project by your own firebase project to get credentials.

- Setup firebase project: https://console.firebase.google.com/ for react native android and ios.
- Download google-services.json and GoogleService-Info.plist.
- Copy and paste to /example/android/app/google-services.json and /example/ios/GoogleService-Info.plist.
- More detail about push notification - https://docs.amity.co/amity-uikit/uikit-v4-beta/installation-guide/react-native#push-notification

3. Configure your apiKey,apiRegion,apiEndpoint,userId,displayName,fcmToken in /example/src/App.tsx file(https://github.com/AmityCo/Amity-Social-UIKit-React-Native-CLI-OpenSource/blob/main/example/src/App.tsx) first before run the sample app
   <img width="658" alt="Screenshot 2567-06-12 at 01 52 46" src="https://github.com/AmityCo/Amity-Social-UIKit-React-Native-CLI-OpenSource/assets/155952277/a312a7db-d790-4af6-9db7-bf085888cd01">

4. Go back to your root folder (`cd ..`) and Choose to run between iOS or Android
5. Install modules and sync file

```sh
yarn
```

6. Run sample app

```sh
yarn example ios
```

or

```
yarn example android
```

### Installation

Here are the steps to install ui-kit together with another React Native project.

```sh
1. git clone https://github.com/AmityCo/Amity-Social-UIKit-React-Native-CLI-OpenSource.git
2. cd Amity-Social-Cloud-UIKit-React-Native-OpenSource
3. yarn or npm install
4. yarn pack or npm pack
```

This step will build the app and return amityco-asc-react-native-ui-kit-x.x.x.tgz file in inside the folder

Then, inside another project, Copy tgz file to your application folder where you need to use ui-kit:

```sh
1. yarn add ./amity-react-native-social-ui-kit-x.x.x.tgz
2. yarn add react-native-safe-area-context react-native-image-picker @react-native-async-storage/async-storage react-native-svg react-native-gesture-handler react-native-screens react-native-video@6.0.0-beta.6 react-native-create-thumbnail @react-native-community/netinfo @react-navigation/native \@react-navigation/native-stack @react-navigation/stack react-native-vision-camera react-native-push-notification \@api.video/react-native-livestream react-native-get-random-values react-native-rsa-native react-native-vlc-media-player
```

### iOS Configuration

In Pod file, add these lines under your target,

```
  pod 'SPTPersistentCache', :modular_headers => true
  pod 'DVAssetLoaderDelegate', :modular_headers => true
  $RNVideoUseVideoCaching = true
```

<img width="610" alt="Update Pod File" src="https://github.com/AmityCo/Amity-Social-UIKit-React-Native-CLI-OpenSource/assets/155952277/40117769-4dee-4506-8b4c-703769fa7f2a">

In XCode,

Set `Minimum Deployments  at least iOS 12.0`

<img width="833" alt="Minimum Deployments  at least iOS 12.0" src="https://github.com/AmityCo/Amity-Social-UIKit-React-Native-CLI-OpenSource/assets/155952277/eb87497c-52ce-4e91-a3ad-f46077724378">

```sh
npx pod-install

```

### Android Configuration

Build project gradle with your Android Studio

In android/build.gradle, add belows in in buildscript > ext

kotlinVersion = 1.7.0 and above
compileSdkVersion = 34
buildToolsVersion = "34.0.0"

<img width="754" alt="Screenshot 2567-06-14 at 19 01 13" src="https://github.com/AmityCo/Amity-Social-UIKit-React-Native-CLI-OpenSource/assets/155952277/82f15d39-8fb0-4b98-b0ec-1dea49a093cf">

### Add Camera permission (iOS)

Add following permissions to `info.plist` file (ios/{YourAppName}/Info.plist)

```sh
 <key>NSCameraUsageDescription</key>
 <string>App needs access to the camera to take photos.</string>
 <key>NSMicrophoneUsageDescription</key>
 <string>App needs access to the microphone to record audio.</string>
 <key>NSPhotoLibraryUsageDescription</key>
 <string>App needs access to the gallery to select photos.</string>
```

### Add Camera permission (Android)

Add following permissions to `AndroidManifest.xml` file (android/app/src/main/AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

### Usage

```js
import * as React from 'react';

import {
  AmityUiKitSocial,
  AmityUiKitProvider,
} from 'amity-react-native-social-ui-kit';

export default function App() {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      apiEndpoint="https://api.{API_REGION}.amity.co"
    >
      <AmityUiKitSocial />
    </AmityUiKitProvider>
  );
}
```

### Customization

Our UIKit v4 supports customization in a single place by modifying a `uikit.config.json` file in related UIKit repository. This configuration file includes all necessary data to customize the appearance of each pages, components and elements that we allow to do customization.
Note: uikit.config.json file should be in your project. Please kindly check in example project.

```js
import * as React from 'react';
import {
  AmityUiKitSocial,
  AmityUiKitProvider,
} from 'amity-react-native-social-ui-kit';
import config from './uikit.config.json';

export default function App() {
  return (
    <AmityUiKitProvider
      configs={config} //put your customized config json object
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      apiEndpoint="https://api.{API_REGION}.amity.co"
    >
      <AmityUiKitSocial />
    </AmityUiKitProvider>
  );
}
```

### Using Theme

#### Using the default theme

AmityUIKit uses the default theme as part of the design language.

#### Theme customization

Without customization, the UIKit already looks good. However, if you wish to customize the theme, you can declare changes to color variables by passing your own color codes to our `uikit.config.json`. Here is the code usage of how to customize the theme.

```json
"preferred_theme": "default",
  "theme": {
    "light": {
      "primary_color": "#1054DE",
      "secondary_color": "#292B32",
      "base_color": "#292b32",
      "base_shade1_color": "#636878",
      "base_shade2_color": "#898e9e",
      "base_shade3_color": "#a5a9b5",
      "base_shade4_color": "#ebecef",
      "alert_color": "#FA4D30",
      "background_color": "#FFFFFF"
    },
    "dark": {
      "primary_color": "#1054DE",
      "secondary_color": "#292B32",
      "base_color": "#ebecef",
      "base_shade1_color": "#a5a9b5",
      "base_shade2_color": "#6e7487",
      "base_shade3_color": "#40434e",
      "base_shade4_color": "#292b32",
      "alert_color": "#FA4D30",
      "background_color": "#191919"
    }
  },
```

#### Dark Mode

The Dark Mode feature in our UIKit enhances user experience by providing an alternative visual style that is particularly beneficial in low-light environments. It's designed to reduce eye strain, improve readability, and offer a more visually comfortable interface. You can enable dark mode by just changing `preferred_theme: "default"` to the `preferred_theme: "dark"` in `uikit.config.json`

```js
"preferred_theme": "dark" // change it to dark || light || default,
```

```
### Documentation


Please refer to our online documentation at https://docs.amity.co or contact a Ui-Kit representative at **clientsolutiomns@amity.co** for support.



```
