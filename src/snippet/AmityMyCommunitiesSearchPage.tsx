/* begin_sample_code
 gist_id: 7b92ee13b126821328f7a5a626741aa4
 filename: AmityMyCommunitiesSearchPage.tsx
 asc_page: https://docs.amity.co/amity-uikit/uikit-v4-beta
 description: AmityMyCommunitiesSearchPage
 */
import {
  AmityMyCommunitiesSearchPage,
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
  <AmityMyCommunitiesSearchPage />
</AmityUiKitProvider>;
/* end_sample_code */
