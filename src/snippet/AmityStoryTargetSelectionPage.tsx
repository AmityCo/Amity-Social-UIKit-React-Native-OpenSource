/* begin_sample_code
 gist_id: b063d97c59ffb3b3bc860040a1ab7b80
 filename: AmityStoryTargetSelectionPage.tsx
 asc_page: https://docs.amity.co/amity-uikit/uikit-v4-beta
 description: AmityStoryTargetSelectionPage
 */
import {
  AmityStoryTargetSelectionPage,
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
    AmityStoryTargetSelectionPageBehavior: {
      goToStoryComposerPage: ({ targetId, targetType }) => {
        console.log(targetId, targetType);
      },
    },
  }}
>
  <AmityStoryTargetSelectionPage />
</AmityUiKitProvider>;
/* end_sample_code */
