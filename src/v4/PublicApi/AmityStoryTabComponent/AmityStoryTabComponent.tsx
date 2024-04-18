import React, { FC, memo, useEffect, useState } from 'react';
import {
  AmityStoryTabComponentEnum,
  AmityStoryTabComponentType,
} from '../types';
import MyStories from '../../component/MyStories';
import CommunityStories from '../../component/CommunityStories';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';

const AmityStoryTabComponent: FC<AmityStoryTabComponentType> = ({
  type,
  targetId,
}) => {
  const [CommunityData, setCommunityData] = useState<Amity.Community>(null);

  useEffect(() => {
    if (type === AmityStoryTabComponentEnum.communityFeed && targetId) {
      CommunityRepository.getCommunity(targetId, ({ error, loading, data }) => {
        if (error) return;
        if (!loading) {
          setCommunityData(data);
        }
      });
    }
  }, [targetId, type]);

  if (type === AmityStoryTabComponentEnum.globalFeed) {
    return <MyStories />;
  }
  if (type === AmityStoryTabComponentEnum.communityFeed) {
    return (
      <CommunityStories
        communityId={targetId}
        displayName={CommunityData?.displayName}
        avatarFileId={CommunityData?.avatarFileId}
      />
    );
  }
  return null;
};

export default memo(AmityStoryTabComponent);
