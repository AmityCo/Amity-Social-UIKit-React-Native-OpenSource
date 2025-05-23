/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useRef, useState } from 'react';
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

import { useStyles } from './styles';
import CloseButton from '../../components/BackButton/index';
import DoneButton from '../../components/DoneButton/index';
import { LoadingOverlay } from '../../components/LoadingOverlay/index';
import { UserRepository } from '@amityco/ts-sdk-react-native';
import useAuth from '../../hooks/useAuth';
import { uploadImageFile } from '../../providers/file-provider';
import { useFocusEffect } from '@react-navigation/native';
import { AvatarIcon } from '../../svg/AvatarIcon';
import CameraIcon from '../../svg/CameraIcon';
import * as ImagePicker from 'expo-image-picker';
interface EditProfileProps {
  navigation: any;
  route: any;
}




export const EditProfile: React.FC<EditProfileProps> = ({
  navigation,
  route,
}) => {
  const styles = useStyles();
  const MAX_CHARACTER_COUNT = 100;
  const { apiRegion } = useAuth();
  const imageUriRef = useRef<string | undefined>(undefined);
  const [imageUri, setImageUri] = useState<string | undefined>('');
  const [displayName, setDisplayName] = useState<string | undefined>();
  const [about, setAbout] = useState<string | undefined>();
  const displayNameRef = useRef(displayName);
  const aboutRef = useRef(about);
  const [displayNameCharacterCount, setDisplayNameCharacterCount] = useState(0);
  const [aboutCharacterCount, setAboutCharacterCount] = useState(0);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const { user } = route.params;

  React.useLayoutEffect(() => {
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

  const avatarFileURL = useCallback(
    (fileId: string) => {
      return `https://api.${apiRegion}.amity.co/api/v3/files/${fileId}/download?size=medium`;
    },
    [apiRegion]
  );

  useFocusEffect(
    useCallback(() => {
      setDisplayName(user.displayName);
      if (user.avatarFileId) {
        setImageUri(avatarFileURL(user.avatarFileId));
        imageUriRef.current = avatarFileURL(user.avatarFileId);
      } else if (user.avatarCustomUrl) {
        setImageUri(avatarFileURL(user.avatarFileId));
        imageUriRef.current = user.avatarCustomUrl;
      }

      setAbout(user.description);
    }, [
      avatarFileURL,
      user.avatarCustomUrl,
      user.avatarFileId,
      user.description,
      user.displayName,
    ])
  );

  const onDonePressed = async () => {
    try {
      setShowLoadingIndicator(true);
      const userDetail: Partial<
        Pick<
          Amity.User,
          | 'displayName'
          | 'avatarFileId'
          | 'avatarCustomUrl'
          | 'description'
          | 'metadata'
        >
      > = {
        displayName: displayNameRef.current,
        description: aboutRef.current ?? '',
      };
      const file: Amity.File<any>[] =
        imageUriRef.current && (await uploadImageFile(imageUriRef.current));
      if (file) {
        userDetail.avatarFileId = file[0].fileId;
        userDetail.avatarCustomUrl = file[0].fileUrl;
      }
      await UserRepository.updateUser(user.userId, userDetail);
    } catch (error) {
      console.error(error);
    } finally {
      setShowLoadingIndicator(false);
    }
  };

  const openCamera = async () => {
    let result: ImagePicker.ImagePickerResult =
    await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
    });
    if (
      result.assets &&
      result.assets.length > 0 &&
      result.assets[0] !== null &&
      result.assets[0]
    ) {
      setImageUri(result.assets[0].uri);
    }

  };

  const openImageGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
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
          {
            imageUri ? <Image
              style={styles.avatar}
              source={
                {
                  uri: imageUri ? imageUri : '',
                }

              }
            /> : <Text ><AvatarIcon width={64} height={64}/></Text>
          }

        </TouchableOpacity>
        <View style={styles.cameraIconContainer}>
          <TouchableOpacity onPress={handleAvatarPress}>
            <View style={styles.cameraIcon}>
              <CameraIcon style={styles.imageIcon} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
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
