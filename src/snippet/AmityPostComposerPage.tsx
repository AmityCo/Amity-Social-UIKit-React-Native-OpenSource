/* begin_sample_code
 gist_id: b3efac9e475a0ffd382607b6b5184ae1
 filename: AmityPostComposerPage.tsx
 asc_page: https://docs.amity.co/amity-uikit/uikit-v4-beta
 description: AmityPostComposerPage
 */
import {
  AmityPostComposerPage,
  AmityUiKitProvider,
  AmityPostComposerMode,
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
  <AmityPostComposerPage
    mode={AmityPostComposerMode.CREATE}
    community={{} as Amity.Community}
    targetId="9263297329" //need only if mode="create"
    targetType="Community" //need only if mode="create"
  />
</AmityUiKitProvider>;
/* end_sample_code */
