import React, { FC, memo, useEffect, useState } from 'react';
import { AmityPostContentComponentStyleEnum } from '../../../enum/AmityPostContentComponentStyle';
import { AmityPostEngagementActionsSubComponent } from './Components';
import { PostTargetType } from '../../../../enum/postTargetType';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';

type AmityPostEngagementActionsComponentType = {
  AmityPostContentComponentStyle?: AmityPostContentComponentStyleEnum;
  targetId: string;
  targetType: PostTargetType;
  postId: string;
};

const AmityPostEngagementActionsComponent: FC<
  AmityPostEngagementActionsComponentType
> = ({
  AmityPostContentComponentStyle = AmityPostContentComponentStyleEnum.detail,
  targetId,
  targetType,
  postId,
}) => {
  const [communityData, setCommunityData] = useState<Amity.Community>(null);

  useEffect(() => {
    if (targetType === 'community' && targetId) {
      CommunityRepository.getCommunity(targetId, ({ data, error, loading }) => {
        if (!error && !loading) {
          setCommunityData(data);
        }
      });
    }
  }, [targetId, targetType]);

  if (
    AmityPostContentComponentStyle === AmityPostContentComponentStyleEnum.feed
  )
    return <AmityPostEngagementActionsSubComponent.FeedStyle postId={postId} />;
  if (
    AmityPostContentComponentStyle === AmityPostContentComponentStyleEnum.detail
  )
    return (
      <AmityPostEngagementActionsSubComponent.DetailStyle
        community={communityData}
        postId={postId}
      />
    );
  return null;
};

export default memo(AmityPostEngagementActionsComponent);
