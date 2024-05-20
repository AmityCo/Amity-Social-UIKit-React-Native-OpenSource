import React, { FC, memo, useEffect, useState } from 'react';
import {
  AmityStoryTabComponentEnum,
  AmityStoryTabComponentType,
} from '../../types';
import MyStories from '../../../component/MyStories';
import CommunityStories from '../../../component/CommunityStories';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import useConfig from '../../../hook/useConfig';
import { ComponentID } from '../../../enum';

const AmityStoryTabComponent: FC<AmityStoryTabComponentType> = ({
  type,
  targetId,
}) => {
  const [CommunityData, setCommunityData] = useState<Amity.Community>(null);
  const { excludes } = useConfig();
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

  if (excludes.includes(`*/${ComponentID.StoryTab}/*`)) return null;

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
