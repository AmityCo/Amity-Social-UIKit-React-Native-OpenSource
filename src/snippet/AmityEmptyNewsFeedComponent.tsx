/* begin_sample_code
 gist_id: 176852a181d7574c61a8d5260e7e8810
 filename: AmityEmptyNewsFeedComponent.tsx
 asc_page: https://docs.amity.co/amity-uikit/uikit-v4-beta
 description: AmityEmptyNewsFeedComponent
 */
import {
  AmityEmptyNewsFeedComponent,
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
>
  <AmityEmptyNewsFeedComponent />
</AmityUiKitProvider>;
/* end_sample_code */
