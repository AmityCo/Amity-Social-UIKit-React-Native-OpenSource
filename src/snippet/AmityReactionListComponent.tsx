/* begin_sample_code
 gist_id: 28f83760eb562da4c163d614a2efa269
 filename: AmityReactionListComponent.tsx
 asc_page: https://docs.amity.co/amity-uikit/uikit-v4-beta
 description: AmityReactionListComponent
 */
import {
  AmityReactionListComponent,
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
  <AmityReactionListComponent
    referenceId="7e93791379"
    referenceType="post"
    isModalVisible={true}
    onCloseModal={() => {}}
  />
</AmityUiKitProvider>;
/* end_sample_code */
