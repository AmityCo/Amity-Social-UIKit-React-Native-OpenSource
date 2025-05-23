/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStyles } from './styles';
import ChooseCategoryModal from '../../components/ChooseCategoryModal';
import { RadioButton } from 'react-native-radio-buttons-group';
import AddMembersModal from '../../components/AddMembersModal';
import type { UserInterface } from '../../types/user.interface';
import {
  createCommunity,
  type ICreateCommunity,
} from '../../providers/Social/communities-sdk';
import useAuth from '../../hooks/useAuth';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import * as ImagePicker from 'expo-image-picker'
import { uploadImageFile } from '../../providers/file-provider';
import { PrivacyState } from '../../enum/privacyState';
import CloseIcon from '../../svg/CloseIcon';
import ArrowOutlinedIcon from '../../svg/ArrowOutlinedIcon';
import PublicIcon from '../../svg/PublicIcon';
import PrivateIcon from '../../svg/PrivateIcon';
import { PlusIcon } from '../../svg/PlusIcon';
import { SvgXml } from 'react-native-svg';
import { userIcon } from '../../svg/svg-xml-list';

export default function CreateCommunity() {
  const styles = useStyles();
  const theme = useTheme() as MyMD3Theme;
  const { apiRegion } = useAuth();
  const [image, setImage] = useState<string>();
  const [communityName, setCommunityName] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [aboutText, setAboutText] = useState('');
  const [categoryModal, setCategoryModal] = useState<boolean>(false);
  const [addMembersModal, setAddMembersModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [selectedUserList, setSelectedUserList] = useState<UserInterface[]>([]);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [isCreateReady, setIsCreateReady] = useState<boolean>(false);
  const [imageFileId, setImageFileId] = useState<string>('');

  const MAX_COMMUNITY_NAME_LENGTH = 30;
  const MAX_ABOUT_TEXT_LENGTH = 180;

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onClickBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerLeft: () => (
        <TouchableOpacity onPress={onClickBack} style={styles.btnWrap}>
          <CloseIcon width={15} height={15} color={theme.colors.base} />
        </TouchableOpacity>
      ),

      headerTitle: 'Create Community',
    });
  }, []);

  const uploadFile = useCallback(async () => {
    const file: Amity.File<any>[] = await uploadImageFile(image);
    if (file) {
      setImageFileId(file[0].fileId);
      setUploadingImage(false);
    }
  }, [image]);
  useEffect(() => {
    if (image) {
      setUploadingImage(true);
      uploadFile();
    }
  }, [image, uploadFile]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setIsCreateReady(false);
      setImage(result.assets[0]?.uri);
    }
  };

  const handleSelectCategory = (categoryId: string, categoryName: string) => {
    setCategoryId(categoryId);
    setCategoryName(categoryName);
  };

  const handleAddMembers = (users: UserInterface[]) => {
    setSelectedUserList(users);
  };
  const avatarFileURL = (fileId: string) => {
    return `https://api.${apiRegion}.amity.co/api/v3/files/${fileId}/download?size=medium`;
  };

  const displayName = (user: string) => {
    const maxLength = 10;
    if (user) {
      if (user!.length > maxLength) {
        return user!.substring(0, maxLength) + '..';
      }
      return user!;
    }
    return 'Display name';
  };

  const onDeleteUserPressed = (user: UserInterface) => {
    const removedUser = selectedUserList.filter((item) => item !== user);
    setSelectedUserList(removedUser);
  };

  useEffect(() => {
    if (selectedId === PrivacyState.public && communityName.length > 0 && categoryId.length > 0 && !uploadingImage) {
      setIsCreateReady(true)

    } else if (selectedId === PrivacyState.private && communityName.length > 0 && categoryId.length > 0 && selectedUserList.length > 0 && !uploadingImage) {
      setIsCreateReady(true)
    }

  }, [communityName, categoryId, selectedId, selectedUserList, uploadingImage])


  const onCreateCommunity = async () => {
    if (!uploadingImage && isCreateReady) {
      const userIds: string[] = selectedUserList.map((item) => item.userId);
      const isPublic: boolean =
        selectedId === PrivacyState.private ? false : true;
      const communityParam: ICreateCommunity = {
        displayName: communityName,
        description: aboutText,
        isPublic: isPublic,
        userIds: userIds,
        category: categoryId,
        avatarFileId: imageFileId,
      };
      const isCreated = await createCommunity(communityParam);
      if (isCreated) {
        navigation.navigate('CommunityHome', {
          communityId: isCreated.communityId,
          communityName: isCreated.displayName,
        });
      }
    }
  }



  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={styles.container}
    >
      <View>
        <View style={styles.uploadContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.defaultImage} />
          )}

          <TouchableOpacity style={styles.button} onPress={pickImage}>
            {/* You can use any icon library here or just text */}
            {/* For example, you can use an icon like: <YourIconName size={24} color="white" /> */}
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.allInputContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.inputTitle}>
                Community name<Text style={styles.requiredField}> *</Text>
              </Text>
              <Text style={styles.inputLengthMeasure}>
                {communityName.length}/{MAX_COMMUNITY_NAME_LENGTH}
              </Text>
            </View>

            <TextInput
              style={styles.inputField}
              placeholder="Name your community"
              placeholderTextColor={theme.colors.baseShade3}
              value={communityName}
              onChangeText={(text) => setCommunityName(text)}
              maxLength={MAX_COMMUNITY_NAME_LENGTH}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.inputTitle}>About</Text>
              <Text style={styles.inputLengthMeasure}>
                {aboutText.length}/{MAX_ABOUT_TEXT_LENGTH}
              </Text>
            </View>

            <TextInput
              style={styles.inputField}
              placeholder="Enter description"
              placeholderTextColor={theme.colors.baseShade3}
              value={aboutText}
              onChangeText={(text) => setAboutText(text)}
              maxLength={MAX_ABOUT_TEXT_LENGTH}
              multiline={true}
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.inputTitle}>
                Category<Text style={styles.requiredField}> *</Text>
              </Text>
            </View>
            <Pressable
              onPress={() => setCategoryModal(true)}
              style={styles.categoryContainer}
            >
              <Text
                style={
                  !categoryName ? styles.placeHolderText : [styles.categoryText]
                }
              >
                {categoryName.length > 0 ? categoryName : 'Select Category'}
              </Text>
              <ArrowOutlinedIcon width={15} height={15} color={theme.colors.base} />
            </Pressable>
          </View>
          <View style={styles.radioGroup}>
            <Pressable
              onPress={() => setSelectedId(PrivacyState.public)}
              style={styles.listItem}
            >
              <View style={styles.avatar}>
                <PublicIcon width={20} height={20} />
              </View>

              <View style={styles.optionDescription}>
                <Text style={styles.itemText}>Public</Text>
                <Text style={styles.categoryText}>
                  Anyone can join, view, and search the posts in this community.
                </Text>
              </View>
              <RadioButton
                id={PrivacyState.public}
                onPress={(value) => setSelectedId(value)}
                value={PrivacyState.public}
                selected={selectedId === PrivacyState.public}
                color={
                  selectedId === PrivacyState.public
                    ? theme.colors.primary
                    : '#444'
                }
                size={17}
              />
            </Pressable>

            <Pressable
              onPress={() => setSelectedId(PrivacyState.private)}
              style={styles.listItem}
            >
              <View style={styles.avatar}>
                <PrivateIcon width={24} height={24} />
              </View>

              <View style={styles.optionDescription}>
                <Text style={styles.itemText}>Private</Text>
                <Text style={styles.categoryText}>
                  Only members invited by the moderators can join, view, and
                  search the posts in this community.
                </Text>
              </View>
              <RadioButton
                id={PrivacyState.private}
                onPress={(value) => setSelectedId(value)}
                value={PrivacyState.private}
                selected={selectedId === PrivacyState.private}
                color={selectedId === PrivacyState.private ? '#1054DE' : '#444'}
                size={17}
              />
            </Pressable>
          </View>
          {selectedId === PrivacyState.private && (
            <View style={styles.inputContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.inputTitle}>
                  Add members<Text style={styles.requiredField}> *</Text>
                </Text>
              </View>
              <View style={styles.addUsersContainer}>
                {selectedUserList.length > 0 && (
                  <FlatList
                    data={selectedUserList}
                    renderItem={({ item }) => (
                      <View style={styles.userItemWrap}>
                        <View style={styles.avatarRow}>
                          <View style={styles.avatarImageContainer}>
                            {
                              item?.avatarFileId ?
                                <Image
                                  style={styles.avatar}
                                  source={
                                    {
                                      uri: item?.avatarFileId && avatarFileURL(item.avatarFileId),
                                    }

                                  }
                                /> : <SvgXml width={28} height={28} xml={userIcon()} />
                            }

                          </View>
                          <Text>{displayName(item.displayName)}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => onDeleteUserPressed(item)}
                        >

                          <CloseIcon width={12} height={12} color={theme.colors.base} />
                        </TouchableOpacity>
                      </View>
                    )}
                    keyExtractor={(item) => item.userId.toString()}
                    numColumns={2}
                  />
                )}

                <Pressable
                  onPress={() => setAddMembersModal(true)}
                  style={styles.addIcon}
                >
                  <View style={styles.avatar}>
                    <PlusIcon style={styles.arrowIcon} width={24} height={24} color={theme.colors.base} />
                  </View>
                </Pressable>
              </View>
            </View>
          )}

          <TouchableOpacity
            disabled={(!isCreateReady) ? true : false}
            onPress={onCreateCommunity}
            style={(!isCreateReady) ? [styles.disableBtn, styles.createButton] : styles.createButton}
          >
            <Text style={styles.createText}>Create community </Text>
            {uploadingImage && (
              <ActivityIndicator
                style={styles.loading}
                animating={true}
                color={'#FFF'}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <ChooseCategoryModal
        onSelect={handleSelectCategory}
        onClose={() => setCategoryModal(false)}
        visible={categoryModal}
      />
      {addMembersModal &&
        <AddMembersModal
          onSelect={handleAddMembers}
          onClose={() => setAddMembersModal(false)}
          visible={addMembersModal}
          initUserList={selectedUserList}
          excludeUserList={[]}
        />}

    </ScrollView>
  );
}
