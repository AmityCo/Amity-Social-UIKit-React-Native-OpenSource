import * as React from 'react';


import { AmityUiKitProvider, AmityUiKitSocial, ExplorePage, MyCommunityPage, Newsfeed, UserProfile, CommunityHome, MyUserProfile } from '@amityco/react-native-social-ui-kit';

import config from '../uikit.config.json';


export default function App() {

  return (
    <AmityUiKitProvider
      configs={config} //put your config json object
      apiKey="b0eaba093fdbf1361f36d849000b4289d80e8ae3b8636d29"
      apiRegion="us"
      userId="topAmity"
      displayName="topAmityDisplayName"
      apiEndpoint="https://api.us.amity.co"
    >
      <AmityUiKitSocial />
    </AmityUiKitProvider>
  );
}
