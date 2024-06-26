import React from 'react';
import { PageID } from '../../../../v4/enum';
import { useBehaviour } from '../../../providers/BehaviourProvider';

import TargetSelectionPage, {
  FeedParams,
} from '../../../component/TargetSelectionPage/TargetSelectionPage';

const AmityStoryTargetSelectionPage = ({ navigation }) => {
  const { AmityStoryTargetSelectionPageBehavior } = useBehaviour();
  const onSelectFeed = ({ targetId, targetType }: FeedParams) => {
    if (AmityStoryTargetSelectionPageBehavior.goToStoryComposerPage) {
      return AmityStoryTargetSelectionPageBehavior.goToStoryComposerPage({
        targetId,
        targetType,
      });
    }
    navigation.navigate('CreateStory', {
      targetId,
      targetType,
    });
  };

  return (
    <TargetSelectionPage
      // Story select target page use this pageId
      pageId={PageID.select_story_target_page}
      onSelectFeed={onSelectFeed}
      hideMyTimelineTarget={true}
    />
  );
};

export default React.memo(AmityStoryTargetSelectionPage);
