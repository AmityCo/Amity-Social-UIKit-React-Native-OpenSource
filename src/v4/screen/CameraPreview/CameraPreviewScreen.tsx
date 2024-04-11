import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import Video from 'react-native-video';
import {
  leftLongArrow,
  rightLongArrow,
  storyHyperLinkIcon,
} from '../../../svg/svg-xml-list';
import { SvgXml } from 'react-native-svg';
import { useStyles } from './styles';
import { StoryRepository } from '@amityco/ts-sdk-react-native';
import { ComponentID, ElementID, PageID, StoryType } from '../../enum';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';
import { useConfigImageUri } from '../../hook/useConfigImageUri';
import HyperlinkConfig from './Components/HyperLinkConfig';

const CameraPreviewScreen = ({ navigation, route }) => {
  const { type, data } = route.params;
  const styles = useStyles();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [hyperlink, setHyperlink] = useState<Amity.StoryItem[]>(undefined);
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
            navigation.goBack();
          },
        },
      ]
    );
  }, [navigation]);

  const onPressAspectRatio = useCallback(() => {
    setIsFullScreen((prev) => !prev);
  }, []);

  const onPressHyperLink = useCallback(() => {
    setIsVisibleModal(true);
  }, []);

  const onPressShareStory = useCallback(async () => {
    const formData = new FormData();
    formData.append('files', data);
    try {
      if (type === StoryType.photo) {
        await StoryRepository.createImageStory(
          'community',
          data.communityId,
          formData,
          {},
          imageDisplayMode,
          hyperlink
        );
      } else {
        await StoryRepository.createVideoStory(
          'community',
          data.communityId,
          formData,
          {},
          hyperlink
        );
      }
      navigation.pop(2);
    } catch (error) {
      Alert.alert('Create Story fail', error.message);
    }
  }, [data, hyperlink, imageDisplayMode, navigation, type]);

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
        {type === StoryType.photo ? (
          <Image
            source={{ uri: data.uri }}
            style={[styles.image, isFullScreen && styles.aspect_ratio]}
          />
        ) : (
          <Video
            repeat
            source={{ uri: data.uri }}
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
        <Image source={{ uri: data.communityAvatar }} style={styles.avatar} />
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
    </SafeAreaView>
  );
};

export default CameraPreviewScreen;
