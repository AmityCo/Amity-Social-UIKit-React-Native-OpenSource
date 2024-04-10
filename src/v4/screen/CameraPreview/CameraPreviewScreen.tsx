import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback } from 'react';
import Video from 'react-native-video';
import { leftLongArrow, rightLongArrow } from '../../../svg/svg-xml-list';
import { SvgXml } from 'react-native-svg';
import { useStyles } from './styles';
import { StoryRepository } from '@amityco/ts-sdk-react-native';
import { StoryType } from '../../enum';

const CameraPreviewScreen = ({ navigation, route }) => {
  const { type, data } = route.params;
  const styles = useStyles();

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
            resizeMode="contain"
            style={styles.image}
          />
        ) : (
          <Video
            source={{ uri: data.uri }}
            resizeMode="cover"
            style={styles.image}
          />
        )}
      </View>
      <TouchableOpacity
        style={styles.shareStoryBtn}
        onPress={onPressShareStory}
      >
        <Image source={{ uri: data.communityAvatar }} style={styles.avatar} />
        <Text style={styles.shareStoryTxt}>Share story</Text>
        <SvgXml xml={rightLongArrow()} width={16} height={16} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.backBtn} onPress={onPressBack}>
        <SvgXml xml={leftLongArrow('white')} width={32} height={32} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CameraPreviewScreen;
