import React from 'react';
import { PageID } from '../../../../v4/enum';

import TargetSelectionPage, {
  FeedParams,
} from '../../../component/TargetSelectionPage/TargetSelectionPage';

const AmityPostTargetSelectionPage = ({ navigation }) => {
  const onSelectFeed = ({ targetId, targetName, targetType }: FeedParams) => {
    navigation.navigate('CreatePost', {
      targetId,
      targetName,
      targetType,
    });
  };

  return (
    <TargetSelectionPage
      pageId={PageID.select_post_target_page}
      onSelectFeed={onSelectFeed}
    />
  );
};

export default React.memo(AmityPostTargetSelectionPage);
