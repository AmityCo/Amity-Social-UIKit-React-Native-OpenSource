import React from 'react';
import { PageID, AmityPostTargetSelectionPageType } from '../../../../v4/enum';
import { useBehaviour } from '../../../providers/BehaviourProvider';

import TargetSelectionPage, {
  FeedParams,
} from '../../../component/TargetSelectionPage/TargetSelectionPage';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const AmityPostTargetSelectionPage = ({
  postType,
}: {
  postType: AmityPostTargetSelectionPageType;
}) => {
  const { AmityPostTargetSelectionPageBehavior } = useBehaviour();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onSelectFeed = ({
    targetId,
    targetName,
    targetType,
    community,
    postSetting,
    needApprovalOnPostCreation,
    isPublic,
  }: FeedParams) => {
    if (postType === AmityPostTargetSelectionPageType.post) {
      if (AmityPostTargetSelectionPageBehavior.goToPostComposerPage) {
        return AmityPostTargetSelectionPageBehavior.goToPostComposerPage({
          community,
          targetId,
          targetType,
        });
      }

      return navigation.navigate('CreatePost', {
        community,
        targetType,
        targetId,
      });
    }

    if (postType === AmityPostTargetSelectionPageType.poll) {
      if (AmityPostTargetSelectionPageBehavior.goToPollComposerPage) {
        return AmityPostTargetSelectionPageBehavior.goToPollComposerPage({
          targetId,
          targetType,
          targetName,
          postSetting,
          needApprovalOnPostCreation,
          isPublic,
        });
      }

      return navigation.navigate('CreatePoll', {
        targetId,
        targetType,
        targetName,
        postSetting,
        needApprovalOnPostCreation,
        isPublic,
      });
    }

    if (postType === AmityPostTargetSelectionPageType.livestream) {
      if (AmityPostTargetSelectionPageBehavior.goToLivestreamComposerPage) {
        return AmityPostTargetSelectionPageBehavior.goToLivestreamComposerPage({
          targetId,
          targetType,
          targetName,
        });
      }

      return navigation.navigate('CreateLivestream', {
        targetId,
        targetType,
        targetName,
      });
    }
  };

  return (
    <TargetSelectionPage
      pageId={PageID.select_post_target_page}
      onSelectFeed={onSelectFeed}
    />
  );
};

export default React.memo(AmityPostTargetSelectionPage);
