import React from 'react';
import { PageID } from '../../../../v4/enum';
import { useBehaviour } from '../../../providers/BehaviourProvider';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TargetSelectionPage, {
  FeedParams,
} from '../../../component/TargetSelectionPage/TargetSelectionPage';

const AmityStoryTargetSelectionPage = () => {
  const { AmityStoryTargetSelectionPageBehavior } = useBehaviour();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

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
      pageId={PageID.select_story_target_page}
      onSelectFeed={onSelectFeed}
      hideMyTimelineTarget={true}
    />
  );
};

export default React.memo(AmityStoryTargetSelectionPage);
