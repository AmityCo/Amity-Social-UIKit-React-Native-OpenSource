/* begin_sample_code
 gist_id: fbefda9418ab9395bd394dfae2d14007
 filename: AmityTopSearchBarComponent.tsx
 asc_page: https://docs.amity.co/amity-uikit/uikit-v4-beta
 description: AmityTopSearchBarComponent
 */
import {
  AmityTopSearchBarComponent,
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
  <AmityTopSearchBarComponent
    setSearchValue={() => {}}
    searchType={TabName.Communities}
  />
</AmityUiKitProvider>;
/* end_sample_code */
