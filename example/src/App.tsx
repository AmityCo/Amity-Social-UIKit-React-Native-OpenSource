import * as React from 'react';

import {
  AmityUiKitChat,
  AmityUiKitProvider,
  AmityUiKitSocial,
} from '@amityco/asc-react-native-ui-kit';

export default function App() {
  return (
    <AmityUiKitProvider
      apiKey="b3babb0b3a89f4341d31dc1a01091edcd70f8de7b23d697f"
      apiRegion="sg"
      userId="John"
      displayName="John"
    >
      <AmityUiKitSocial />
    </AmityUiKitProvider>
  );
}
