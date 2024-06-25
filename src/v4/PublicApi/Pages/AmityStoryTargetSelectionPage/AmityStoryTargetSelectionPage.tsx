import React from 'react';
import { PageID } from '../../../../v4/enum';

import TargetSelectionPage, {
  FeedParams,
} from '../../../component/TargetSelectionPage/TargetSelectionPage';

const AmityStoryTargetSelectionPage = ({ navigation }) => {
  const onSelectFeed = ({ targetId, targetName, targetType }: FeedParams) => {
    navigation.navigate('CreateStory', {
      targetId,
      targetName,
      targetType,
    });
  };

  return (
    <TargetSelectionPage
      // Story select target page use this pageId
      pageId={PageID.SelectTargetPage}
      onSelectFeed={onSelectFeed}
    />
  );
};

export default React.memo(AmityStoryTargetSelectionPage);
