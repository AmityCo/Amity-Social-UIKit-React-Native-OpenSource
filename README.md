<div align="center">
<img src="https://github.com/AmityCo/Amity-Social-UIKit-React-Native-OpenSource/assets/112688936/ddeeef20-2dfa-449e-bd3d-62238d7c9be0" width="160" >
<img src="https://github.com/AmityCo/Amity-Social-UIKit-React-Native-OpenSource/assets/112688936/e6b2d2a2-5158-429e-b1af-ea679b14fc11" width="150">
<h1>Amity Ui-Kit for React native (open-source)</h1> 
</div>
** This is the beta version **

## Getting started

### Sample app

#### Run sample app with expo
Use yarn

1. Install packages
```
yarn
```
2. Configure your apiKey,apiRegion,userId,displayName in /example/src/App.tsx file(https://github.com/AmityCo/Amity-Social-Cloud-UIKit-React-Native-OpenSource/blob/main/example/src/App.tsx) first before run the sample app

3. Choose to run between iOS or Android

```sh
yarn example ios
```

or

```
yarn example android
```

### Installation

```sh
1. git clone git@github.com:AmityCo/Amity-Social-Cloud-UIKit-React-Native-OpenSource.git
2. cd Amity-Social-Cloud-UIKit-React-Native-OpenSource
3. npm install
4. npm pack
```

This step will build the app and return amityco-asc-react-native-ui-kit-x.x.x.tgz.tgz file in inside the folder

Then, inside another project, where need to use ui-kit:

```sh
1. npm install ./../asc-react-native-ui-kit/amityco-asc-react-native-ui-kit-0.1.0.tgz
2. npm install react-native-safe-area-context \react-native-image-picker \@react-native-async-storage/async-storage \react-native-svg@13.4.0 \react-native-screens
3. npx install-expo-modules@latest
```
### iOS Configuration
```sh
npx pod-install

```

### Expo CLI Camera and Gallery Configuration

```sh
 expo install expo-image-picker \

```
### Add Camera permission iOS
Add following permissions to `info.plist` file (ios/{YourAppName}/Info.plist)

```sh
 <key>NSCameraUsageDescription</key>
 <string>App needs access to the camera to take photos.</string>
 <key>NSMicrophoneUsageDescription</key>
 <string>App needs access to the microphone to record audio.</string>
 <key>NSCameraUsageDescription</key>
 <string>App needs access to the camera to take photos.</string>

```

### Usage

```js
import * as React from 'react';

import {
  AmityUiKitSocial,
  AmityUiKitProvider,
} from '@amityco/asc-react-native-ui-kit';

export default function App() {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="sg"
      userId="userId"
      displayName="displayName"
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
