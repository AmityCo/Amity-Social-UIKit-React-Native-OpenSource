/* begin_sample_code
 gist_id: 8223e93247a4aaeeca60ea651f14168a
 filename: AmityUserSearchResultComponent.tsx
 asc_page: https://docs.amity.co/amity-uikit/uikit-v4-beta
 description: AmityUserSearchResultComponent
 */
import {
  AmityUserSearchResultComponent,
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
  <AmityUserSearchResultComponent
    searchResult={[{}] as (Amity.Community & Amity.User)[]}
    onNextPage={() => {}}
  />
</AmityUiKitProvider>;
/* end_sample_code */
