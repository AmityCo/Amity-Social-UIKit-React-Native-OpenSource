/* begin_sample_code
 gist_id: 3ec04da66a931c826f471ef50a90c7b9
 filename: AmityGlobalFeedComponent.tsx
 asc_page: https://docs.amity.co/amity-uikit/uikit-v4-beta
 description: AmityGlobalFeedComponent
 */
import {
  AmityGlobalFeedComponent,
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
    AmityGlobalFeedComponentBehavior: {
      goToPostDetailPage: (postId: string) => {
        console.log(postId);
      },
    },
  }}
>
  <AmityGlobalFeedComponent />
</AmityUiKitProvider>;
/* end_sample_code */
