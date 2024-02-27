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

2. Configure your apiKey,apiRegion,apiEndpoint,userId,displayName in /example/src/App.tsx file(https://github.com/AmityCo/Amity-Social-UIKit-React-Native-CLI-OpenSource/blob/main/example/src/App.tsx) first before run the sample app
   <img width="1503" alt="Screenshot 2566-09-18 at 00 32 49" src="https://github.com/AmityCo/Amity-Social-UIKit-React-Native-CLI-OpenSource/assets/112688936/2939ed92-3bfd-4a90-b2a7-f5aafccef084">

3. Go back to your root folder (`cd ..`) and Choose to run between iOS or Android
4. Install modules and sync file

```sh
yarn
```

5. Run sample app

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
2. yarn add react-native-safe-area-context \react-native-image-picker \@react-native-async-storage/async-storage \react-native-svg \react-native-screens \"react-native-video@^6.0.0-beta.5" \react-native-create-thumbnail
```

### iOS Configuration

In Pod file, add these lines under your target,  

```
  pod 'SPTPersistentCache', :modular_headers => true
  pod 'DVAssetLoaderDelegate', :modular_headers => true
  $RNVideoUseVideoCaching = true  
```

 <img width="650" alt="Update Pod File" src="https://private-user-images.githubusercontent.com/155952277/306702506-94ca36af-d378-4028-a4ec-9b4d90e0047b.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkwMzAxMTIsIm5iZiI6MTcwOTAyOTgxMiwicGF0aCI6Ii8xNTU5NTIyNzcvMzA2NzAyNTA2LTk0Y2EzNmFmLWQzNzgtNDAyOC1hNGVjLTliNGQ5MGUwMDQ3Yi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwMjI3JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDIyN1QxMDMwMTJaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT00M2U1NDViZjdmYjcyY2VjNTU5ZDkzMjAyMTFkOGMwMmFjMWE3MDVkNGQ1Y2FkZmU3MjBlNTJhYjExMjc3N2ExJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.reYP207FKDDud51R4OXghtCC2Z4HObASAJK-QHsrWxs">

In XCode, 

Set `Minimum Deployments  at least iOS 12.0`

<img width="1500" alt="Minimum Deployments  at least iOS 12.0" src="https://private-user-images.githubusercontent.com/155952277/306706261-54c48612-f3ac-4caa-ad47-0a05abee0e53.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkwMzAxMTIsIm5iZiI6MTcwOTAyOTgxMiwicGF0aCI6Ii8xNTU5NTIyNzcvMzA2NzA2MjYxLTU0YzQ4NjEyLWYzYWMtNGNhYS1hZDQ3LTBhMDVhYmVlMGU1My5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwMjI3JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDIyN1QxMDMwMTJaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT05YTczZDNmYTNkMDU1N2U1ZjBjODMzZDllZDBhNThiZTU2MDY5NWU0ZDFiNzdhMmRhMjY4YTlkMTIzNjlhYTBmJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.UNr0_5JqGukaoqEAyVL4zBBWRTTs2H6o4HDDAmGiNb4">

```sh
npx pod-install

```

### Android Configuration

Build project gradle with your Android Studio

In android/build.gradle,  add kotlinVersion above 1.7.0 in buildscript > ext  

<img width="650" alt="add kotlinVersion above 1.7.0" src="https://private-user-images.githubusercontent.com/155952277/306702063-43943488-c055-4ecc-9cec-d279e7828a91.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkwMzAxMTIsIm5iZiI6MTcwOTAyOTgxMiwicGF0aCI6Ii8xNTU5NTIyNzcvMzA2NzAyMDYzLTQzOTQzNDg4LWMwNTUtNGVjYy05Y2VjLWQyNzllNzgyOGE5MS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwMjI3JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDIyN1QxMDMwMTJaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT00YmJjYmJhOGRlZTA2YTBlN2Q2YmVkNDE0YjA0MTk2MWI3YjFjMWY5YTUwNzBkY2UyMTY2NWE3ZDdkZTFhMjMyJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.9zg0EQNwFXWL-Eu-07yntUbM57-xNNf0QW-2l6o3RBo">

### Add Camera permission (only iOS)

Add following permissions to `info.plist` file (ios/{YourAppName}/Info.plist)

```sh
 <key>NSCameraUsageDescription</key>
 <string>App needs access to the camera to take photos.</string>
 <key>NSMicrophoneUsageDescription</key>
 <string>App needs access to the microphone to record audio.</string>
 <key>NSCameraUsageDescription</key>
 <string>App needs access to the camera to take photos.</string>
 <key>NSPhotoLibraryUsageDescription</key>
 <string>App needs access to the gallery to select photos.</string>
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

### Using Theme

#### Using the default theme

AmityUIKit uses the default theme as part of the design language.

#### Theme customization

Without customization, the UIKit already looks good. However, if you wish to customize the theme, you can declare changes to color variables by passing your own color codes to our UIKit. Here is the code usage of how to customize the theme.

```js
import * as React from 'react';

import {
  AmityUiKitSocial,
  AmityUiKitProvider,
} from 'amity-react-native-social-ui-kit';

export default function App() {
  const myTheme = {
    primary: '#1054DE', // Primary color for main elements
    secondary: '#636878', // Secondary color UI elements e.g comment bubble, input bar
    background: '#1E1E1E', // Background color for components
    border: '#EBECEF', // Border color for elements
    base: '#FFFFFF', // Base color for main text, Title, input text
    baseShade1: '#EBECEF', // Base color for Sub Text, Sub Title, TimeStamp Text
    baseShade2: '#EBECEF', // Base color for comments, like text
    baseShade3: '#EBECEF', // Base color for placeHolder
    screenBackground: '#000000', // Background color for screens
  };

  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      apiEndpoint="https://api.{API_REGION}.amity.co"
      theme={myTheme}
    >
      <AmityUiKitSocial />
    </AmityUiKitProvider>
  );
}
```

#### Dark Mode

The Dark Mode feature in our UIKit enhances user experience by providing an alternative visual style that is particularly beneficial in low-light environments. It's designed to reduce eye strain, improve readability, and offer a more visually comfortable interface. You can enable dark mode by just passing variable `darkMode` to the `AmityUiKitProvider`

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
      darkMode
    >
      <AmityUiKitSocial />
    </AmityUiKitProvider>
  );
}
```

```
### Documentation


Please refer to our online documentation at https://docs.amity.co or contact a Ui-Kit representative at **clientsolutiomns@amity.co** for support.



```
