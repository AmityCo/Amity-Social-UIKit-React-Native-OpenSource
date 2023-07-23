/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActionSheetIOS,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { styles } from './styles';
import CloseButton from '../../components/BackButton/index';
import DoneButton from '../../components/DoneButton/index';
import { LoadingOverlay } from '../../components/LoadingOverlay/index';
import { UserRepository } from '@amityco/ts-sdk';

interface EditProfileProps {
  navigation: any;
  route: any;
}

export interface Action {
  title: string;
  type: 'capture' | 'library';
  options: CameraOptions | ImageLibraryOptions;
}

const actions: Action[] = [
  {
    title: 'Take Image',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    },
  },
  {
    title: 'Select Image',
    type: 'library',
    options: {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    },
  },
];

export const EditProfile: React.FC<EditProfileProps> = ({
  navigation,
  route,
}) => {
  const MAX_CHARACTER_COUNT = 100;
  const [imageUri, setImageUri] = useState<string | undefined>();
  const imageUriRef = useRef(imageUri);
  const [displayName, setDisplayName] = useState<string | undefined>();
  const [about, setAbout] = useState<string | undefined>();
  const displayNameRef = useRef(displayName);
  const aboutRef = useRef(about);
  const [displayNameCharacterCount, setDisplayNameCharacterCount] = useState(0);
  const [aboutCharacterCount, setAboutCharacterCount] = useState(0);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const { user } = route.params;

  React.useLayoutEffect(() => {
    // Set the headerRight component to a TouchableOpacity
    navigation.setOptions({
      headerLeft: () => <CloseButton />,
      title: 'Edit Profile',
      headerRight: () => (
        <DoneButton
          navigation={navigation}
          onDonePressed={onDonePressed}
          buttonTxt="Save"
        />
      ),
    });
  }, [navigation]);
  const avatarFileURL = (fileId: string) => {
    return `https://api.amity.co/api/v3/files/${fileId}/download?size=medium`;
  };
  useEffect(() => {
    setDisplayName(user.displayName);
    if (user.avatarFileId) {
      setImageUri(avatarFileURL(user.avatarFileId));
    } else if (user.avatarCustomUrl) {
      setImageUri(user.avatarCustomUrl);
    }

    setAbout(user.description);
  }, []);

  const onDonePressed = async () => {
    try {
      setShowLoadingIndicator(true);
      const { data: updatedUser } = await UserRepository.updateUser(
        user.userId,
        {
          displayName: displayNameRef.current,
          description: aboutRef.current,
        }
      );
      console.log('Update user success ' + JSON.stringify(updatedUser));
    } catch (error) {
      console.error(error);
    } finally {
      setShowLoadingIndicator(false);
    }
  };

  const openCamera = async () => {
    await launchCamera(
      actions[0] as unknown as CameraOptions,
      (response: ImagePickerResponse) => {
        if (!response.didCancel && !response.errorCode) {
          if (response.assets) {
            imageUriRef.current = (
              response.assets[0] as Record<string, any>
            ).uri;
            setImageUri((response.assets[0] as Record<string, any>).uri);
          }
        }
      }
    );
  };

  const openImageGallery = async () => {
    await launchImageLibrary(
      actions[1] as unknown as ImageLibraryOptions,
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log(
            'ImagePicker Error: ',
            response.errorCode + ', ' + response.errorMessage
          );
        } else {
          if (response.assets) {
            imageUriRef.current = (
              response.assets[0] as Record<string, any>
            ).uri;
            setImageUri((response.assets[0] as Record<string, any>).uri);
          }
        }
      }
    );
  };

  const handleAvatarPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            openCamera();
          } else if (buttonIndex === 2) {
            openImageGallery();
          }
        }
      );
    } else {
      Alert.alert('Select a Photo', '', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: openCamera },
        { text: 'Choose from Library', onPress: openImageGallery },
      ]);
    }
  };

  const handleDisplayNameTextChange = (text: string) => {
    displayNameRef.current = text;
    setDisplayName(text);
    setDisplayNameCharacterCount(text.length);
  };
  const handleAboutTextChange = (text: string) => {
    aboutRef.current = text;
    setAbout(text);
    setAboutCharacterCount(text.length);
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay
        isLoading={showLoadingIndicator}
        loadingText="Loading..."
      />
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={handleAvatarPress}>
          <Image
            style={styles.avatar}
            source={
              imageUri
                ? { uri: imageUri }
                : require('../../../assets/icon/Placeholder.png')
            }
          />
        </TouchableOpacity>
        <View style={styles.cameraIconContainer}>
          <TouchableOpacity onPress={handleAvatarPress}>
            <View style={styles.cameraIcon}>
              <Image
                source={require('../../../assets/icon/cameraIcon.png')}
                style={styles.imageIcon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/* <View style={styles.displayNameContainer}>
        <Text style={styles.displayNameText}>Group name</Text>
        <View style={styles.characterCountContainer}>
          <Text
            style={styles.characterCountText}
          >{`${displayNameCharacterCount}/${MAX_CHARACTER_COUNT}`}</Text>
        </View>
      </View> */}
      <View style={styles.displayNameContainer}>
        <Text style={styles.displayNameText}>Display name*</Text>
        <View style={styles.characterCountContainer}>
          <Text
            style={styles.characterCountText}
          >{`${displayNameCharacterCount}/${MAX_CHARACTER_COUNT}`}</Text>
        </View>
      </View>

      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={handleDisplayNameTextChange}
        maxLength={MAX_CHARACTER_COUNT}
        placeholder=""
        placeholderTextColor="#a0a0a0"
      />
      <View style={styles.displayNameContainer}>
        <Text style={styles.displayNameText}>About</Text>
        <View style={styles.characterCountContainer}>
          <Text
            style={styles.characterCountText}
          >{`${aboutCharacterCount}/${MAX_CHARACTER_COUNT}`}</Text>
        </View>
      </View>
      <TextInput
        style={styles.input}
        value={about}
        onChangeText={handleAboutTextChange}
        maxLength={MAX_CHARACTER_COUNT}
        placeholder=""
        placeholderTextColor="#a0a0a0"
      />
    </View>
  );
};
