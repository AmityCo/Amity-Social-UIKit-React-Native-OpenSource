import * as React from 'react';

import {
  AmityUiKitSocial,
  AmityUiKitProvider,
} from '@amityco/asc-react-native-ui-kit';

export default function App() {
  return (
    <AmityUiKitProvider
<<<<<<< Updated upstream
      apiKey="YOUR_API_KEY" // Put your apiKey
      apiRegion="API_REGION" // Put your apiRegion
      userId="USER_ID" // Put your UserId
      displayName="DISPLAYNAME" // Put your displayName
      apiEndpoint="API_ENDPOINT" //"https://api.{apiRegion}.amity.co" e.g "https://api.eu.amity.co"
=======
      apiKey="b3babb0b3a89f4341d31dc1a01091edcd70f8de7b23d697f"
      apiRegion="sg"
      userId="John"
      displayName="John"
      apiEndpoint="https://api.sg.amity.co"
>>>>>>> Stashed changes
    >
      <AmityUiKitSocial />
    </AmityUiKitProvider>
  );
}
