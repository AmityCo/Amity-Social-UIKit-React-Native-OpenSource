/* begin_sample_code
 gist_id: 1f58d75e6a2c28030889829970748307
 filename: AmityPostContentComponent.tsx
 asc_page: https://docs.amity.co/amity-uikit/uikit-v4-beta
 description: AmityPostContentComponent
 */
import {
  AmityPostContentComponent,
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
  <AmityPostContentComponent post={{} as Amity.Post} />
</AmityUiKitProvider>;
/* end_sample_code */
