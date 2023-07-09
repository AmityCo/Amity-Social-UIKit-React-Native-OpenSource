# Amity Ui-Kit for React native (open-source)

**_ Chat UIKit support only right now_**

**_ This is the beta version, Social UIKit is underdevelopment and will be released soon_**

## Getting started

### Sample app

Run sample app with expo\
1. Install packages

```
yarn install
```

2. Navigate to example folder (sample app project)

```
cd example
```

3. Install sample app dependencies

```
yarn install
```

4. Configure your apiKey,apiRegion,userId,displayName in /example/src/App.tsx file(https://github.com/AmityCo/Amity-Social-Cloud-UIKit-React-Native-OpenSource/blob/main/example/src/App.tsx) first before run the sample app

5. Once the installation and Configuration are done, navigate back to the root project

```
cd ..
```

Choose to run between iOS or Android

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
2. npm install react-native-safe-area-context \ react-native-screens \ react-native-image-picker \ @react-native-async-storage/async-storage \ react-native-svg@13.4.0
3. npx install-expo-modules@latest
```

### Expo CLI Camera and Gallery Configuration

```sh
 expo install expo-image-picker \

```

### React Native CLI Camera and Gallery Configuration

```sh
 npm install react-native-image-picker
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
      <AmityUiKitChat />
    </AmityUiKitProvider>
  );
}
```

```
### Documentation


Please refer to our online documentation at https://docs.amity.co or contact a Ui-Kit representative at **clientsolutiomns@amity.co** for support.



```
