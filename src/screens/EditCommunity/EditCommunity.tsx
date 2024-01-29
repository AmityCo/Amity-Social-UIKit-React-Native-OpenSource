import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
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
import { SvgXml } from 'react-native-svg';
import {
  arrowOutlined,
  closeIcon,
  plusIcon,
  privateIcon,
  publicIcon,
} from '../../svg/svg-xml-list';
import { useStyles } from './styles';
import ChooseCategoryModal from '../../components/ChooseCategoryModal';
import { RadioButton } from 'react-native-radio-buttons-group';
import AddMembersModal from '../../components/AddMembersModal';
import type { UserInterface } from 'src/types/user.interface';
import useAuth from '../../hooks/useAuth';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageFile } from '../../providers/file-provider';
import { getAvatarURL } from '../../util/apiUtil';
import { updateCommunity } from '../../providers/Social/communities-sdk';
import { PrivacyState } from '../../enum/privacyState';
import { useForm, Controller } from 'react-hook-form';

const EditCommunity = ({ navigation, route }) => {
  const styles = useStyles();
  const theme = useTheme() as MyMD3Theme;
  const {
    communityData: { data },
  }: { communityData: { data: Amity.RawCommunity } } = route.params;
  const { apiRegion } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, defaultValues },
    watch,
  } = useForm({
    defaultValues: {
      community_name: data.displayName,
      community_description: data.description,
    },
  });
  const [image, setImage] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>(data.categoryIds[0]);
  const [categoryModal, setCategoryModal] = useState<boolean>(false);
  const [addMembersModal, setAddMembersModal] = useState<boolean>(false);
  const [isPublic, setisPublic] = useState(data.isPublic);
  const [selectedUserList, setSelectedUserList] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFileId, setImageFileId] = useState<string>(data.avatarFileId);

  const MAX_COMMUNITY_NAME_LENGTH = 30;
  const MAX_ABOUT_TEXT_LENGTH = 180;

  const onPressUpdateCommunity = useCallback(
    async ({
      community_name,
      community_description,
    }: {
      community_name: string;
      community_description: string;
    }) => {
      const communityDetail = {
        isPublic: isPublic,
        description: community_description,
        displayName: community_name,
        category: categoryId,
        avatarFileId: imageFileId,
      };
      try {
        setLoading(true);
        await updateCommunity(data.communityId, communityDetail);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        navigation.navigate({
          name: 'CommunityHome',
          params: {
            communityId: data.communityId,
            communityName: communityDetail.displayName,
          },
          merge: true,
        });
      }
    },
    [categoryId, data, imageFileId, isPublic, navigation]
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          disabled={loading}
          onPress={handleSubmit(onPressUpdateCommunity)}
        >
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [
    handleSubmit,
    loading,
    navigation,
    onPressUpdateCommunity,
    styles.saveText,
  ]);

  useEffect(() => {
    data.avatarFileId && setImage(getAvatarURL(apiRegion, data.avatarFileId));
  }, [apiRegion, data.avatarFileId]);

  const uploadFile = useCallback(async () => {
    try {
      const file: Amity.File<any>[] = await uploadImageFile(image);
      if (file) {
        setImageFileId(file[0].fileId);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [image]);

  useEffect(() => {
    if (image) {
      setLoading(true);
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
                {watch('community_name')
                  ? `${
                      watch('community_name').length
                    } / ${MAX_COMMUNITY_NAME_LENGTH}`
                  : `0/ ${MAX_COMMUNITY_NAME_LENGTH}`}
              </Text>
            </View>
            <Controller
              name="community_name"
              control={control}
              render={({ field: { onChange } }) => (
                <TextInput
                  defaultValue={defaultValues.community_name}
                  style={styles.inputField}
                  placeholder="Name your community"
                  placeholderTextColor={theme.colors.baseShade3}
                  onChangeText={onChange}
                  maxLength={MAX_COMMUNITY_NAME_LENGTH}
                />
              )}
              rules={{ required: 'Community name is required!' }}
            />
            {errors.community_name && (
              <Text style={styles.errorText}>
                {errors.community_name.message?.toString()}
              </Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.inputTitle}>About</Text>
              <Text style={styles.inputLengthMeasure}>
                {watch('community_description')
                  ? `${
                      watch('community_description').length
                    } / ${MAX_ABOUT_TEXT_LENGTH}`
                  : `0/ ${MAX_ABOUT_TEXT_LENGTH}`}
              </Text>
            </View>

            <Controller
              name="community_description"
              control={control}
              render={({ field: { onChange } }) => (
                <TextInput
                  defaultValue={defaultValues.community_description}
                  style={styles.inputField}
                  placeholder="Enter description"
                  placeholderTextColor={theme.colors.baseShade3}
                  onChangeText={onChange}
                  maxLength={MAX_ABOUT_TEXT_LENGTH}
                  multiline={true}
                />
              )}
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
              <SvgXml
                style={styles.arrowIcon}
                xml={arrowOutlined(theme.colors.base)}
                width={15}
                height={15}
              />
            </Pressable>
          </View>
          <View style={styles.radioGroup}>
            <Pressable
              onPress={() => setisPublic(true)}
              style={styles.listItem}
            >
              <View style={styles.avatar}>
                <SvgXml width={20} height={20} xml={publicIcon} />
              </View>

              <View style={styles.optionDescription}>
                <Text style={styles.itemText}>Public</Text>
                <Text style={styles.categoryText}>
                  Anyone can join, view, and search the posts in this community.
                </Text>
              </View>
              <RadioButton
                id={PrivacyState.public}
                onPress={() => setisPublic(true)}
                value={PrivacyState.public}
                selected={isPublic}
                color={isPublic ? theme.colors.primary : '#444'}
                size={17}
              />
            </Pressable>

            <Pressable
              onPress={() => setisPublic(false)}
              style={styles.listItem}
            >
              <View style={styles.avatar}>
                <SvgXml width={24} height={24} xml={privateIcon()} />
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
                onPress={() => setisPublic(false)}
                value={PrivacyState.private}
                selected={!isPublic}
                color={!isPublic ? '#1054DE' : '#444'}
                size={17}
              />
            </Pressable>
          </View>
          {!isPublic && (
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
                            <Image
                              style={styles.avatarImage}
                              source={
                                item.avatarFileId
                                  ? {
                                      uri: getAvatarURL(
                                        apiRegion,
                                        item.avatarFileId
                                      ),
                                    }
                                  : require('../../../assets/icon/Placeholder.png')
                              }
                            />
                          </View>
                          <Text>{displayName(item.displayName)}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => onDeleteUserPressed(item)}
                        >
                          <SvgXml
                            xml={closeIcon(theme.colors.base)}
                            width={12}
                            height={12}
                          />
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
                    <SvgXml
                      style={styles.arrowIcon}
                      xml={plusIcon(theme.colors.base)}
                      width={24}
                      height={24}
                    />
                  </View>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>
      <ChooseCategoryModal
        onSelect={handleSelectCategory}
        onClose={() => setCategoryModal(false)}
        visible={categoryModal}
        categoryId={categoryId}
      />
      <AddMembersModal
        onSelect={handleAddMembers}
        onClose={() => setAddMembersModal(false)}
        visible={addMembersModal}
        initUserList={selectedUserList}
      />
    </ScrollView>
  );
};

export default EditCommunity;
