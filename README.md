<div align="center">
<img src="https://github.com/AmityCo/Amity-Social-UIKit-React-Native-OpenSource/assets/112688936/ddeeef20-2dfa-449e-bd3d-62238d7c9be0" width="160" >
<img src="https://github.com/AmityCo/Amity-Social-UIKit-React-Native-OpenSource/assets/112688936/e6b2d2a2-5158-429e-b1af-ea679b14fc11" width="150">
<h1>Amity Ui-Kit for React native open-source (Expo)</h1>
  ** This is the beta version. The repo will be updated frequently.
Please go to <strong>this repo</strong> if you want only native librairies inside the UIKit (https://github.com/AmityCo/Amity-Social-UIKit-React-Native-CLI-OpenSource) **
</div>
<div align="center">
 <img width="250" alt="Screenshot_2566-07-24_at_19 16 20-removebg-preview" src="https://github.com/AmityCo/Amity-Social-UIKit-React-Native-OpenSource/assets/112688936/ce60425f-b478-408b-88c3-341d00263760">
 <img width="286" alt="Screenshot_2566-07-24_at_19 16 20-removebg-preview" src="https://github.com/AmityCo/Amity-Social-UIKit-React-Native-OpenSource/assets/112688936/843d3dc7-094f-4e29-812b-9fc864a96c14">
</div>

## Getting started
Our AmityUIKit include user interfaces to enable fast integration of standard Amity Social features into new or existing applications. Furthermore, our React Native UIKit supports integration with **Expo**, providing you with a flexible experience to seamlessly integrate social features into your existing React Native application.

### Try Sample app
This repository also includes a built-in sample app which you can use to test your code while customizing it, or even explore our UIKit features with just a few installations!

## Prerequisites

Before you begin, ensure your development environment meets the following requirements:

- **Expo SDK**: version **53**
- **Node.js**: version **22** or above
-  **React Navigation**: version **7** or above


##  Metro Config for React Native 0.76+

If you're using **React Native 0.76 or above**, make sure to update your `metro.config.js` file to include `config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native'];`. This helps the Metro bundler resolve conditional exports correctly.

###  Updated `metro.config.js`

```js
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native']; // add this to your metro.config.js

module.exports = config;
```

### Run sample app with Expo module
Use yarn

1. Install packages
```
cd example
```

```
yarn
```
2. Configure your apiKey,apiRegion,apiEndpoint,userId,displayName in /example/src/App.tsx file(https://github.com/AmityCo/Amity-Social-UIKit-React-Native-OpenSource/blob/main/example/src/App.tsx) first before run the sample app
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

1. Clone the repository
```sh
   git clone https://github.com/AmityCo/Amity-Social-UIKit-React-Native-OpenSource.git
```
2. Navigate to the cloned repository's directory:
```sh
  cd Amity-Social-Cloud-UIKit-React-Native-OpenSource
```
3. Install the dependencies using yarn
```sh
  yarn
```
4. Pack the project using npm (`yarn pack` is not supported by the UIKit at the moment`)
```sh
  npm pack
```
This step will build the app and return amityco-asc-react-native-ui-kit-x.x.x.tgz file in inside the folder

Then, inside another project, Copy tgz file to your application folder where you need to use ui-kit:

5. Install UIKit package to the application folder
```sh
 yarn add ./amityco-react-native-social-ui-kit-x.x.x.tgz
```
or
```sh
npm install ./amityco-react-native-social-ui-kit-x.x.x.tgz
```
6. Install required peer dependencies

```sh
 yarn add react-native-safe-area-context @react-navigation/native @react-navigation/native-stack @react-navigation/stack react-native-screens react-native-svg
```
```sh
 npm install react-native-safe-area-context @react-navigation/native @react-navigation/native-stack @react-navigation/stack react-native-screens react-native-svg
```
   

### Usage

```js
import * as React from 'react';

import {
  AmityUiKitSocial,
  AmityUiKitProvider,
} from '@amityco/react-native-social-ui-kit';

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
} from '@amityco/react-native-social-ui-kit';
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
