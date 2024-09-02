/* begin_sample_code
 gist_id: 60de42520b795efd3bd1ec26672e27c4
 filename: AmityMediaAttachmentComponent.tsx
 asc_page: https://docs.amity.co/amity-uikit/uikit-v4-beta
 description: AmityMediaAttachmentComponent
 */
import {
  AmityMediaAttachmentComponent,
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
  <AmityMediaAttachmentComponent
    onPressCamera={() => {}}
    onPressImage={() => {}}
    onPressVideo={() => {}}
    chosenMediaType={mediaAttachment.image}
  />
</AmityUiKitProvider>;
/* end_sample_code */
