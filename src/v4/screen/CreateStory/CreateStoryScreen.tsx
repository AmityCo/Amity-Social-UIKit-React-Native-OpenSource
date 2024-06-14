import React from 'react';
import { useCameraDevice } from 'react-native-vision-camera';
import { AmityCreateStoryPage } from '../../index';
import { useRequestPermission } from '../../hook/useCamera';
import { Alert, Linking } from 'react-native';

const CreateStoryScreen = ({ navigation, route }) => {
  const { targetId, targetType } = route.params as {
    targetId: string;
    targetType: Amity.StoryTargetType;
  };

  useRequestPermission({
    onRequestPermissionFailed: () => {
      Linking.openSettings();
    },
    shouldCall: true,
  });

  const backCamera = useCameraDevice('back');
  const frontCamera = useCameraDevice('front');

  if (!frontCamera && !backCamera) {
    Alert.alert('Camera Error', 'Cannot open camera', [
      {
        text: 'Go Back',
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
    return null;
  }

  return (
    <AmityCreateStoryPage
      targetId={targetId}
      targetType={targetType}
      onCreateStory={() => navigation.goBack()}
    />
  );
};

export default CreateStoryScreen;
