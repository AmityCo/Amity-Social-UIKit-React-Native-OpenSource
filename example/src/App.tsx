import * as React from 'react';
import {
  AmityUiKitProvider,
  AmityUiKitSocial,
} from '@amityco/asc-react-native-ui-kit';

export default function App() {
  return (
    <AmityUiKitProvider
      apiKey="b0e9e10f6edef1331e66d91f035d148fd40a8de3eb363a2d"
      apiRegion="eu"
      userId="topAmity"
      displayName="topAmity"
      apiEndpoint="https://api.eu.amity.co"
    >
      <AmityUiKitSocial />
    </AmityUiKitProvider>
  );
}
