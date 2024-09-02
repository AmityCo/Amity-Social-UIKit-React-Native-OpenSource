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

import { getStyles } from './styles';
import CloseButton from '../../components/BackButton/index';
import DoneButton from '../../components/DoneButton/index';
import { LoadingOverlay } from '../../components/LoadingOverlay/index';
import { UserRepository } from '@amityco/ts-sdk-react-native';
import useAuth from '../../hooks/useAuth';
import * as ImagePicker from 'expo-image-picker';
interface EditProfileProps {
    navigation: any;
    route: any;
}




export const EditProfile: React.FC<EditProfileProps> = ({
    navigation,
    route,
}) => {
    const styles = getStyles();
    const MAX_CHARACTER_COUNT = 100;
    const { apiRegion } = useAuth();
    const [imageUri, setImageUri] = useState<string | undefined>();
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
    const avatarFileURL = (fileId: string) => {
        return `https://api.${apiRegion}.amity.co/api/v3/files/${fileId}/download?size=medium`;
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
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri((result.assets[0] as Record<string, any>).uri);
        }
    };

    const pickCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.granted) {
            let result: ImagePicker.ImagePickerResult =
                await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: false,
                    aspect: [4, 3],
                });

            if (
                result.assets &&
                result.assets.length > 0 &&
                result.assets[0] !== null &&
                result.assets[0]
            ) {
                setImageUri((result.assets[0] as Record<string, any>).uri);
            }
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
                        pickCamera();
                    } else if (buttonIndex === 2) {
                        pickImage();
                    }
                }
            );
        } else {
            Alert.alert('Select a Photo', '', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Take Photo', onPress: pickCamera },
                { text: 'Choose from Library', onPress: pickImage },
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