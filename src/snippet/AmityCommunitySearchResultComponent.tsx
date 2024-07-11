/* begin_sample_code
 gist_id: 1c885a98ffdc94f5f3336e477ffce9d6
 filename: AmityCommunitySearchResultComponent.tsx
 asc_page: https://docs.amity.co/amity-uikit/uikit-v4-beta
 description: AmityCommunitySearchResultComponent
 */
import {
  AmityCommunitySearchResultComponent,
  AmityUiKitProvider,
} from 'amity-react-native-social-ui-kit';
import React from 'react';
import config from '../../uikit.config.json';
import { TabName } from '../v4/enum';
<AmityUiKitProvider
  configs={config} //put your customized config json object
  apiKey="API_KEY"
  apiRegion="API_REGION"
  userId="userId"
  displayName="displayName"
  apiEndpoint="https://api.{API_REGION}.amity.co"
>
  <AmityCommunitySearchResultComponent
    searchResult={[{}] as (Amity.Community & Amity.User)[]}
    onNextPage={() => {}}
    searchType={TabName.Communities}
  />
</AmityUiKitProvider>;
/* end_sample_code */
