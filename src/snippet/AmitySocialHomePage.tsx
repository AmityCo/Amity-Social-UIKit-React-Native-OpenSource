/* begin_sample_code
 gist_id: 8ca969055c904f77851cac166d8c98f2
 filename: AmitySocialHomePage.tsx
 asc_page: https://docs.amity.co/amity-uikit/uikit-v4-beta
 description: Amity Social Home Page
 */
import {
  AmitySocialHomePage,
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
    AmitySocialHomePageBehaviour: { onChooseTab: (tab) => console.log(tab) },
  }}
>
  <AmitySocialHomePage />
</AmityUiKitProvider>;
/* end_sample_code */
