import React, { memo, useCallback, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useStyles } from './styles';
import { useStory } from '../../hook/useStory';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import {
  storyCircleCreatePlusIcon,
  storyRing,
} from '../../../svg/svg-xml-list';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/RouteParamList';
import { useFile } from '../../hook/useFile';
import { ImageSizeState } from '../../enum/imageSizeState';
import { useStoryPermission } from '../../hook/useStoryPermission';
import useConfig from '../../hook/useConfig';
import { ComponentID, ElementID, PageID } from '../../enum';
import Modal from 'react-native-modalbox';
import AmityViewStoryPage from '../../PublicApi/Pages/AmityViewStoryPage/AmityViewStoryPage';

interface ICommunityStories {
  communityId: string;
  displayName: string;
  avatarFileId: string;
}

const CommunityStories = ({
  communityId,
  displayName,
  avatarFileId,
}: ICommunityStories) => {
  const navigation =
    useNavigation() as NativeStackNavigationProp<RootStackParamList>;
  const styles = useStyles();
  const { getUiKitConfig } = useConfig();
  const hasStoryPermission = useStoryPermission(communityId);
  const { getStoryTarget, storyTarget } = useStory();
  const { getImage } = useFile();
  const [avatarUrl, setAvatarUrl] = useState(undefined);
  const [viewStory, setViewStory] = useState(false);
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
    (async () => {
      const avatarImage = await getImage({
        fileId: avatarFileId,
        imageSize: ImageSizeState.small,
      });
      setAvatarUrl(avatarImage);
    })();
  }, [avatarFileId, getImage]);

  useFocusEffect(
    useCallback(() => {
      getStoryTarget({
        targetId: communityId,
        targetType: 'community',
      });
    }, [communityId, getStoryTarget])
  );

  const onPressCreateStory = useCallback(() => {
    hasStoryPermission &&
      navigation.navigate('CreateStory', {
        targetId: communityId,
        targetType: 'community',
      });
  }, [communityId, hasStoryPermission, navigation]);

  const onPressStoryView = useCallback(() => {
    setViewStory(true);
  }, []);

  const onPressAvatar = useCallback(() => {
    setViewStory(false);
    onPressCreateStory();
  }, [onPressCreateStory]);
  const onPressCommunityName = useCallback(() => {
    setViewStory(false);
    navigation.navigate('CommunityHome', {
      communityId: communityId,
      communityName: displayName,
    });
  }, [communityId, displayName, navigation]);

  const renderCommunityStory = () => {
    if (storyTarget?.lastStoryExpiresAt) {
      return (
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={onPressStoryView}
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
            width={48}
            height={48}
            xml={storyRing(storyRingColor[0], storyRingColor[1])}
          />
          {hasStoryPermission && (
            <SvgXml
              style={styles.storyCreateIcon}
              xml={storyCircleCreatePlusIcon()}
            />
          )}
        </TouchableOpacity>
      );
    }
    if (hasStoryPermission) {
      return (
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={onPressCreateStory}
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
            width={48}
            height={48}
            xml={storyRing('#EBECEF', '#EBECEF')}
          />
          <SvgXml
            style={styles.storyCreateIcon}
            xml={storyCircleCreatePlusIcon()}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const onFinish = useCallback(() => {
    setViewStory(false);
    getStoryTarget({
      targetId: communityId,
      targetType: 'community',
    });
  }, [communityId, getStoryTarget]);

  return (
    <View style={styles.container}>
      {renderCommunityStory()}
      <Modal
        style={styles.modal}
        isOpen={viewStory}
        onClosed={() => setViewStory(false)}
        position="center"
        swipeToClose
        swipeArea={250}
        backButtonClose
        coverScreen={true}
      >
        <AmityViewStoryPage
          targetId={communityId}
          targetType="community"
          onFinish={onFinish}
          onPressAvatar={onPressAvatar}
          onPressCommunityName={onPressCommunityName}
        />
      </Modal>
    </View>
  );
};

export default memo(CommunityStories);
