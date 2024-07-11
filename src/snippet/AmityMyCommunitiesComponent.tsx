/* begin_sample_code
 gist_id: 106d5ba6c2ce0a1125a4d7fd9019489f
 filename: AmityMyCommunitiesComponent.tsx
 asc_page: https://docs.amity.co/amity-uikit/uikit-v4-beta
 description: AmityMyCommunitiesComponent
 */
import {
  AmityMyCommunitiesComponent,
  AmityUiKitProvider,
} from 'amity-react-native-social-ui-kit';
import React from 'react';
import config from '../../uikit.config.json';
<AmityUiKitProvider
  configs={config} //put your customized config json object
  apiKey="API_KEY"
  apiRegion="API_REGION"
  userId="userId"
  displayName="displayName"
  apiEndpoint="https://api.{API_REGION}.amity.co"
  behaviour={{
    AmityMyCommunitiesComponentBehaviour: {
      onPressCommunity: ({ communityId, communityName }) => {
        console.log(communityId, communityName);
      },
    },
  }}
>
  <AmityMyCommunitiesComponent />
</AmityUiKitProvider>;
/* end_sample_code */
