import React, { FC, memo, useEffect, useState } from 'react';
import { AmityPostContentComponentStyleEnum } from '../../enum/AmityPostContentComponentStyle';
import { AmityPostEngagementActionsSubComponent } from './Components';

import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import { ComponentID, PageID } from '../../enum';
import { PostTargetType } from '../../enum/postTargetType';

type AmityPostEngagementActionsComponentType = {
  AmityPostContentComponentStyle?: AmityPostContentComponentStyleEnum;
  targetId: string;
  targetType: PostTargetType;
  postId: string;
  pageId?: PageID;
  componentId?: ComponentID;
};

const AmityPostEngagementActionsComponent: FC<
  AmityPostEngagementActionsComponentType
> = ({
  AmityPostContentComponentStyle = AmityPostContentComponentStyleEnum.detail,
  targetId,
  targetType,
  postId,
  pageId = PageID.WildCardPage,
  componentId = ComponentID.WildCardComponent,
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
    return (
      <AmityPostEngagementActionsSubComponent.FeedStyle
        pageId={pageId}
        componentId={componentId}
        postId={postId}
      />
    );
  if (
    AmityPostContentComponentStyle === AmityPostContentComponentStyleEnum.detail
  )
    return (
      <AmityPostEngagementActionsSubComponent.DetailStyle
        community={communityData}
        postId={postId}
        pageId={pageId}
        componentId={componentId}
      />
    );
  return null;
};

export default memo(AmityPostEngagementActionsComponent);
