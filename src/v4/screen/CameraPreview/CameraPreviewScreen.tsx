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
import { leftLongArrow, rightLongArrow } from '../../../svg/svg-xml-list';
import { SvgXml } from 'react-native-svg';
import { useStyles } from './styles';
import { StoryRepository } from '@amityco/ts-sdk-react-native';
import { ComponentID, ElementID, PageID, StoryType } from '../../enum';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';
import { useConfigImageUri } from '../../hook/useConfigImageUri';

const CameraPreviewScreen = ({ navigation, route }) => {
  const { type, data } = route.params;
  const styles = useStyles();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const theme = useTheme() as MyMD3Theme;
  const aspectRatioIcon = useConfigImageUri({
    configPath: {
      page: PageID.CreateStoryPage,
      component: ComponentID.WildCardComponent,
      element: ElementID.AspectRatioBtn,
    },
    configKey: 'aspect_ratio_icon',
  });
  const resizeMode = isFullScreen ? 'contain' : 'cover';
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

  const onPressShareStory = useCallback(async () => {
    const formData = new FormData();
    formData.append('files', data);
    try {
      if (type === StoryType.photo) {
        StoryRepository.createImageStory(
          'community',
          data.communityId,
          formData
        );
      } else {
        StoryRepository.createVideoStory(
          'community',
          data.communityId,
          formData
        );
      }
      navigation.pop(2);
    } catch (error) {
      Alert.alert('Create Story fail', error.message);
    }
  }, [data, navigation, type]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        {type === StoryType.photo ? (
          <Image
            source={{ uri: data.uri }}
            resizeMode={resizeMode}
            style={[styles.image, isFullScreen && styles.aspect_ratio]}
          />
        ) : (
          <Video
            repeat
            source={{ uri: data.uri }}
            resizeMode={resizeMode}
            style={[styles.image, isFullScreen && styles.aspect_ratio]}
          />
        )}
      </View>
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
    </SafeAreaView>
  );
};

export default CameraPreviewScreen;
