import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, useCallback, useState, useEffect, memo } from 'react';
import Video from 'react-native-video';
import {
  leftLongArrow,
  rightLongArrow,
  storyHyperLinkIcon,
} from '../../../../svg/svg-xml-list';
import { SvgXml } from 'react-native-svg';
import { useStyles } from './styles';
import {
  CommunityRepository,
  StoryRepository,
} from '@amityco/ts-sdk-react-native';
import {
  ComponentID,
  ElementID,
  PageID,
  StoryType,
  ImageSizeState,
} from '../../../enum';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';
import { useConfigImageUri } from '../../../hook/useConfigImageUri';
import HyperlinkConfig from './Components/HyperLinkConfig';
import { IAmityDraftStoryPage } from '../../types';
import { useFile } from '../../../hook/useFile';
import { defaultAvatarUri } from '../../../assets/index';
import { getMediaTypeFromUrl } from '../../../../util/urlUtil';
import { LoadingOverlay } from '../../../../components/LoadingOverlay';

const AmityDraftStoryPage: FC<IAmityDraftStoryPage> = ({
  targetId,
  targetType,
  mediaType,
  onCreateStory,
  onDiscardStory,
}) => {
  const type = getMediaTypeFromUrl(mediaType.uri);
  const styles = useStyles();
  const { getImage } = useFile();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [communityAvatarUrl, setCommunityAvatarUrl] = useState<string>(null);
  const [hyperlink, setHyperlink] = useState<Amity.StoryItem[]>(undefined);
  const [loading, setLoading] = useState(false);
  const imageDisplayMode: Amity.ImageDisplayMode = isFullScreen
    ? 'fill'
    : 'fit';
  const theme = useTheme() as MyMD3Theme;
  const aspectRatioIcon = useConfigImageUri({
    configPath: {
      page: PageID.CreateStoryPage,
      component: ComponentID.WildCardComponent,
      element: ElementID.AspectRatioBtn,
    },
    configKey: 'aspect_ratio_icon',
  });
  const hyperLinkIcon = useConfigImageUri({
    configPath: {
      page: PageID.CreateStoryPage,
      component: ComponentID.WildCardComponent,
      element: ElementID.StoryHyperLinkBtn,
    },
    configKey: 'hyperlink_button_icon',
  });

  useEffect(() => {
    if (!targetId || targetType !== 'community')
      return setCommunityAvatarUrl(defaultAvatarUri);
    CommunityRepository.getCommunity(
      targetId,
      async ({ error, loading, data }) => {
        if (error) return;
        if (!loading) {
          const image = await getImage({
            fileId: data.avatarFileId,
            imageSize: ImageSizeState.small,
          });
          setCommunityAvatarUrl(image);
        }
      }
    )();
  }, [getImage, targetId, targetType]);

  const onPressBack = useCallback(() => {
    Alert.alert(
      'Discard this story?',
      'The story will be permanently deleted. It cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            onDiscardStory();
          },
        },
      ]
    );
  }, [onDiscardStory]);

  const onPressAspectRatio = useCallback(() => {
    setIsFullScreen((prev) => !prev);
  }, []);

  const onPressHyperLink = useCallback(() => {
    setIsVisibleModal(true);
  }, []);

  const onPressShareStory = useCallback(async () => {
    const formData = new FormData();
    formData.append('files', mediaType);

    try {
      setLoading(true);
      if (type === StoryType.image) {
        await StoryRepository.createImageStory(
          'community',
          targetId,
          formData,
          {},
          imageDisplayMode,
          hyperlink
        );
      } else {
        await StoryRepository.createVideoStory(
          'community',
          targetId,
          formData,
          {},
          hyperlink
        );
      }
    } catch (error) {
      Alert.alert('Create Story fail', error.message);
    } finally {
      setLoading(false);
      onCreateStory();
    }
  }, [hyperlink, imageDisplayMode, mediaType, onCreateStory, targetId, type]);

  const onHyperLinkSubmit = useCallback(
    (item?: { url: string; customText: string }) => {
      if (!item) {
        setHyperlink(undefined);
        setIsVisibleModal(false);
        return;
      }
      const storyItem: Amity.StoryItem = {
        data: item,
        type: 'hyperlink' as Amity.StoryItemType.Hyperlink,
      };
      setHyperlink([storyItem]);
      setIsVisibleModal(false);
    },
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        {type === StoryType.image ? (
          <Image
            source={{ uri: mediaType.uri }}
            style={[styles.image, isFullScreen && styles.aspect_ratio]}
          />
        ) : (
          <Video
            paused={loading}
            repeat
            source={{ uri: mediaType.uri }}
            style={[styles.image, isFullScreen && styles.aspect_ratio]}
          />
        )}
      </View>
      {hyperlink?.length > 0 && (
        <TouchableOpacity
          style={styles.hyperlinkContainer}
          onPress={onPressHyperLink}
        >
          <SvgXml xml={storyHyperLinkIcon('blue')} width="25" height="25" />
          <Text style={styles.hyperlinkText}>
            {hyperlink[0].data.customText.length === 0
              ? hyperlink[0].data.url
              : hyperlink[0].data.customText}
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.shareStoryBtn}
        onPress={onPressShareStory}
      >
        <Image source={{ uri: communityAvatarUrl }} style={styles.avatar} />
        <Text style={styles.shareStoryTxt}>Share story</Text>
        <SvgXml
          xml={rightLongArrow(theme.colors.baseShade2)}
          width={16}
          height={16}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.backBtn} onPress={onPressBack}>
        <SvgXml xml={leftLongArrow('white')} width={32} height={32} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.aspectRatioBtn}
        onPress={onPressAspectRatio}
      >
        <Image source={aspectRatioIcon} style={styles.aspectRationIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.hyperLinkBtn} onPress={onPressHyperLink}>
        <Image source={hyperLinkIcon} style={styles.hyperLinkIcon} />
      </TouchableOpacity>
      <HyperlinkConfig
        isVisibleModal={isVisibleModal}
        setIsVisibleModal={setIsVisibleModal}
        onHyperLinkSubmit={onHyperLinkSubmit}
        hyperlinkItem={hyperlink?.[0]?.data}
      />
      <LoadingOverlay isLoading={loading} />
    </SafeAreaView>
  );
};

export default memo(AmityDraftStoryPage);
