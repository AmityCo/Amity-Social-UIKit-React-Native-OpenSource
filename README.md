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
#### Run sample app with Expo module
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
 yarn add ./amityco-asc-react-native-ui-kit-3.0.0.tgz
```
or
```sh
npm install ./amityco-asc-react-native-ui-kit-3.0.0.tgz
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
} from '@amityco/asc-react-native-ui-kit';

export default function App() {

 const myTheme = {
  primary: '#1054DE',      // Primary color for main elements
  secondary: '#636878',    // Secondary color UI elements e.g comment bubble, input bar 
  background: '#1E1E1E',   // Background color for components
  border: '#EBECEF',       // Border color for elements
  base: '#FFFFFF',         // Base color for main text, Title, input text 
  baseShade1: '#EBECEF',   // Base color for Sub Text, Sub Title, TimeStamp Text
  baseShade2: '#EBECEF',   // Base color for comments, like text
  baseShade3: '#EBECEF',   // Base color for placeHolder
  screenBackground: '#000000' // Background color for screens
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
} from '@amityco/asc-react-native-ui-kit';

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
