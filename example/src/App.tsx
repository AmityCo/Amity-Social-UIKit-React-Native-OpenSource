import * as React from 'react';


import { AmityUiKitProvider, AmityUiKitSocial } from '@amityco/react-native-social-ui-kit';
import { Text } from 'react-native';
import config from '../uikit.config.json';

export default function App() {

  return (
    <AmityUiKitProvider
      configs={config} //put your config json object
      apiKey="b3babb0b3a89f4341d31dc1a01091edcd70f8de7b23d697f"
      apiRegion="sg"
      userId="topAmity"
      displayName="topAmity"
      apiEndpoint="https://api.sg.amity.co"
    >
      <AmityUiKitSocial />
    </AmityUiKitProvider>
  );
}
