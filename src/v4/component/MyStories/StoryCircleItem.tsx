import { Image, TouchableOpacity } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { SvgXml } from 'react-native-svg';
import { storyRing } from '../../../svg/svg-xml-list';
import { ComponentID, ElementID, ImageSizeState, PageID } from '../../enum';
import { useFile } from '../../hook';
import useConfig from '../../hook/useConfig';
import { useStyles } from './styles';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';

interface IStoryCircleItem {
  onPressStoryView: (storyTarget: Amity.StoryTarget) => void;
  storyTarget: Amity.StoryTarget;
}

const StoryCircleItem: FC<IStoryCircleItem> = ({
  onPressStoryView,
  storyTarget,
}) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const { getImage } = useFile();
  const { getUiKitConfig } = useConfig();
  const styles = useStyles();
  const storyRingColor: string[] = storyTarget?.hasUnseen
    ? (getUiKitConfig({
        page: PageID.StoryPage,
        component: ComponentID.StoryTab,
        element: ElementID.StoryRing,
      })?.progress_color as string[]) ?? ['#e2e2e2', '#e2e2e2']
    : storyTarget?.failedStoriesCount > 0
    ? ['#DE1029', '#DE1029']
    : ['#e2e2e2', '#e2e2e2'];

  useEffect(() => {
    if (storyTarget.targetType !== 'community') return;
    CommunityRepository.getCommunity(
      storyTarget.targetId,
      async ({ error, loading, data }) => {
        if (error) return;
        if (!loading) {
          const avatarImage = await getImage({
            fileId: data.avatarFileId,
            imageSize: ImageSizeState.small,
          });
          setAvatarUrl(avatarImage);
        }
      }
    );
  }, [getImage, storyTarget.targetId, storyTarget.targetType]);

  if (storyTarget.targetType !== 'community') return null;

  return (
    <TouchableOpacity
      key={storyTarget.targetId}
      style={styles.avatarContainer}
      onPress={() => onPressStoryView(storyTarget)}
    >
      <Image
        source={
          avatarUrl
            ? {
                uri: avatarUrl,
              }
            : require('../../assets/icon/Placeholder.png')
        }
        style={styles.communityAvatar}
      />
      <SvgXml
        style={styles.storyRing}
        width={68}
        height={68}
        xml={storyRing(storyRingColor[0], storyRingColor[1])}
      />
    </TouchableOpacity>
  );
};

export default StoryCircleItem;
