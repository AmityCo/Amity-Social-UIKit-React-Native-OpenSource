import React from 'react';
import { PageID } from '../../../../v4/enum';
import { useBehaviour } from '../../../providers/BehaviourProvider';

import TargetSelectionPage, {
  FeedParams,
} from '../../../component/TargetSelectionPage/TargetSelectionPage';

const AmityPostTargetSelectionPage = ({ navigation, route }) => {
  const { postType } = route.params;

  const { AmityPostTargetSelectionPageBehavior } = useBehaviour();

  const onSelectFeed = ({
    targetId,
    targetName,
    targetType,
    community,
    postSetting,
    needApprovalOnPostCreation,
    isPublic,
  }: FeedParams) => {
    if (postType === 'post') {
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

    if (postType === 'poll') {
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

    if (postType === 'livestream') {
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

      return navigation.navigate('CreateLivestream', {
        targetId,
        targetType,
        targetName,
        postSetting,
        needApprovalOnPostCreation,
        isPublic,
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
