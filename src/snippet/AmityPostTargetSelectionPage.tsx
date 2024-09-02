/* begin_sample_code
 gist_id: 282c34eb1ad1b1dc3c9309f3eaa70685
 filename: AmityPostTargetSelectionPage.tsx
 asc_page: https://docs.amity.co/amity-uikit/uikit-v4-beta
 description: AmityPostTargetSelectionPage
 */
import {
  AmityPostTargetSelectionPage,
  AmityUiKitProvider,
  AmityPostTargetSelectionPageType,
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
    AmityPostTargetSelectionPageBehavior: {
      goToPostComposerPage: () => {},
      goToLivestreamComposerPage: () => {},
      goToPollComposerPage: () => {},
    },
  }}
>
  <AmityPostTargetSelectionPage
    postType={AmityPostTargetSelectionPageType.post}
  />
</AmityUiKitProvider>;
/* end_sample_code */
