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
      if (type === 'photo') {
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
      navigation.navigate('CommunityHome', {
        communityId: data.communityId,
        communityName: data.communityName,
      });
    } catch (error) {
      Alert.alert('Create Story fail', error.message);
    }
  }, [data, navigation, type]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        {type === 'photo' ? (
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
