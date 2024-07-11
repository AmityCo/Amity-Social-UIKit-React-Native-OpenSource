/* begin_sample_code
 gist_id: 54dc7a4a9622fc95b747022a18e11e77
 filename: AmityPostDetailPage.tsx
 asc_page: https://docs.amity.co/amity-uikit/uikit-v4-beta
 description: AmityPostDetailPage
 */
import {
  AmityPostDetailPage,
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
  <AmityPostDetailPage postId="7297262927392" />
</AmityUiKitProvider>;
/* end_sample_code */
