# Amity Ui-Kit for React native  (open-source)

## Getting started

### Installation
```sh
1. git clone git@github.com:AmityCo/Amity-Social-Cloud-UIKit-React-Native-OpenSource.git
2. cd Amity-Social-Cloud-UIKit-React-Native-OpenSource
3. npm pack
```
This step will build the app and return amityco-asc-react-native-ui-kit-x.x.x.tgz.tgz file in inside the folder

Then, inside another project, where need to use ui-kit:
```sh
1. npm install ./../asc-react-native-ui-kit/amityco-asc-react-native-ui-kit-0.1.0.tgz'
2. npm install react-native-safe-area-context@4.4.1 --save
```
### Usage
```js
import * as React from 'react';

import {
  AppNavigator,
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
      <AppNavigator />
    </AmityUiKitProvider>
  );
}

```
### Documentation


Please refer to our online documentation at https://docs.amity.co or contact a Ui-Kit representative at **clientsolutiomns@amity.co** for support.



