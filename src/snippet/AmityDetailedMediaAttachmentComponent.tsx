/* begin_sample_code
 gist_id: 193a12ef8f7aea1032e8884898ed2193
 filename: AmityDetailedMediaAttachmentComponent.tsx
 asc_page: https://docs.amity.co/amity-uikit/uikit-v4-beta
 description: AmityDetailedMediaAttachmentComponent
 */
import {
  AmityDetailedMediaAttachmentComponent,
  AmityUiKitProvider,
  mediaAttachment,
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
  <AmityDetailedMediaAttachmentComponent
    onPressCamera={() => {}}
    onPressImage={() => {}}
    onPressVideo={() => {}}
    chosenMediaType={mediaAttachment.image}
  />
</AmityUiKitProvider>;
/* end_sample_code */
