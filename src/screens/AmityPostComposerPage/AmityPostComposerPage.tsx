import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StatusBar,

} from 'react-native';
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import {
  ImageSizeState,
  PageID,
  mediaAttachment,
} from '../../enum';

import { useStyles } from './styles';



import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import uiSlice from '../../redux/slices/uiSlice';
import { amityPostsFormatter } from '../../util/postDataFormatter';
import useAuth from '../../hooks/useAuth';
import globalfeedSlice from '../../redux/slices/globalfeedSlice';
import {
  createPostToFeed,
  editPost,
  getPostById,
} from '../../providers/Social/feed-sdk';
import * as ImagePicker from 'expo-image-picker';


import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/RouteParamList';
import { PostRepository, UserRepository } from '@amityco/ts-sdk-react-native';
import { AmityPostComposerMode, AmityPostComposerPageType, IDisplayImage } from '../../types/global.interface';
import { TSearchItem, useAmityPage, useIsCommunityModerator, useKeyboardStatus } from '../../hooks';
import { IMentionPosition } from '../../types/type';
import AmityMentionInput from '../../components/MentionInput/AmityMentionInput';
import LoadingImage from '../../components/LoadingImageV4';
import LoadingVideo from '../../components/LoadingVideoV4';
import AmityMediaAttachmentComponent from '../../components/AmityMediaAttachmentComponent/AmityMediaAttachmentComponent';
import AmityDetailedMediaAttachmentComponent from '../../components/AmityDetailedMediaAttachmentComponent/AmityDetailedMediaAttachmentComponent';
import { useFileV4 } from '../../hooks/useFilev4';
import CloseIcon from '../../svg/CloseIcon';


const AmityPostComposerPage: FC<AmityPostComposerPageType> = ({
  mode,
  targetId,
  targetType,
  community,
  post,
}) => {

  const pageId = PageID.post_composer_page;
  const { isExcluded, themeStyles, accessibilityId } = useAmityPage({ pageId });
  const styles = useStyles(themeStyles);
  const { getImage } = useFileV4();
  const isEditMode = mode === AmityPostComposerMode.EDIT;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isKeyboardShowing } = useKeyboardStatus();
  const { client } = useAuth();
  const dispatch = useDispatch();
  const { addPostToGlobalFeed, updateByPostId } = globalfeedSlice.actions;

  const isModerator = useIsCommunityModerator({
    communityId: community?.communityId,
    userId: (client as Amity.Client)?.userId,
  });
  const { showToastMessage, hideToastMessage } = uiSlice.actions;
  const [inputMessage, setInputMessage] = useState<string>('');
  const [mentionsPosition, setMentionsPosition] = useState<IMentionPosition[]>(
    []
  );
  const [chosenMediaType, setChosenMediaType] = useState<mediaAttachment>(null);
  const [displayImages, setDisplayImages] = useState<IDisplayImage[]>([]);
  const [displayVideos, setDisplayVideos] = useState<IDisplayImage[]>([]);
  const [mentionUsers, setMentionUsers] = useState<TSearchItem[]>([]);
  const [isShowingSuggestion, setIsShowingSuggestion] = useState(false);
  const [initialText, setInitialText] = useState(post?.data.text ?? '');
  const [isSwipeup, setIsSwipeup] = useState(true);
  const [deletedPostIds, setDeletedPostIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [hasChangedAttachment, setHasChangedAttachment] = useState(false);
  const privateCommunityId = !community?.isPublic && community?.communityId;
  const title = isEditMode
    ? 'Edit Post'
    : community?.displayName ?? 'My Timeline';
  const isInputValid =
    !isUploading &&
    inputMessage.trim().length <= 50000 &&
    (inputMessage.trim().length > 0 ||
      displayImages.length > 0 ||
      displayVideos.length > 0) &&
    (displayImages.length <= 10 || displayVideos.length <= 10);

  const checkIsEditValid = useCallback(() => {
    return (
      isInputValid &&
      (inputMessage !== post?.data?.text || hasChangedAttachment)
    );
  }, [hasChangedAttachment, inputMessage, isInputValid, post?.data?.text]);

  const parsePostText = useCallback(
    (text: string, mentionUsersArr: TSearchItem[]) => {
      const parsedText = text.replace(/@([\w\s-]+)/g, (_, username) => {
        const mentionee = mentionUsersArr.find(
          (user) => user.displayName === username
        );
        const mentioneeId = mentionee ? mentionee.userId : '';
        return `@[${username}](${mentioneeId})`;
      });
      return parsedText;
    },
    []
  );

  const getPostInfo = useCallback(
    async (postArray: string[]) => {
      try {
        const response = await Promise.all(
          postArray.map(async (id: string) => {
            const { data } = await getPostById(id);
            return data;
          })
        );

        response.forEach(async (item) => {
          if (item?.dataType === 'image') {
            const fileId = item?.data?.fileId;
            const url = await getImage({
              fileId: fileId,
              imageSize: ImageSizeState.full,
            });
            setDisplayImages((prev) => [
              ...prev,
              {
                url,
                fileId,
                fileName: fileId,
                isUploaded: true,
                postId: item.postId,
              },
            ]);
          } else if (item?.dataType === 'video') {
            const fileId = item?.data?.videoFileId?.original;
            const thumbnailFileId = item?.data?.thumbnailFileId;
            const fileUrls = await Promise.allSettled(
              [fileId, thumbnailFileId].map(async (id) => {
                return await getImage({
                  fileId: id,
                  imageSize: ImageSizeState.full,
                });
              })
            );
            setDisplayVideos((prev) => [
              ...prev,
              {
                //@ts-ignore
                url: fileUrls[0]?.value,
                fileId: fileId,
                fileName: fileId,
                isUploaded: true,
                //@ts-ignore
                thumbNail: fileUrls[1]?.value,
                postId: item.postId,
              },
            ]);
          }
        });
      } catch (error) {
        console.log('error: ', error);
      }
    },
    [getImage]
  );

  useEffect(() => {
    setDeletedPostIds([]);
    return () => setDeletedPostIds([]);
  }, []);

  useEffect(() => {
    post?.childrenPosts && getPostInfo(post.childrenPosts);
  }, [getPostInfo, post?.childrenPosts]);

  const getMentionPositions = useCallback(
    (text: string, mentioneeIds: string[]) => {
      let index = 0;
      let mentions = [];
      let match;
      const mentionRegex = /@([\w-]+)/g;

      while ((match = mentionRegex.exec(text)) !== null) {
        let username = match[1];
        let mentioneeId = mentioneeIds[index++];
        let startIdx = match.index;
        let mention = {
          type: 'user',
          displayName: username,
          index: startIdx,
          length: match[0].length,
          userId: mentioneeId,
        };
        mentions.push(mention);
      }
      return mentions;
    },
    []
  );

  const getMentionUsers = useCallback(
    async (mentionIds: string[]) => {
      const { data } = await UserRepository.getUserByIds(mentionIds);
      const users = data.map((user) => {
        return {
          ...user,
          name: user.displayName,
          id: user.userId,
        };
      }) as TSearchItem[];

      setMentionUsers(users);
      const parsedText = parsePostText(post?.data?.text ?? '', users);
      setInitialText(parsedText);
      return users;
    },
    [parsePostText, post?.data?.text]
  );

  useEffect(() => {
    if (post?.mentionees?.length > 0) {
      const mentionPositions = getMentionPositions(
        post?.data?.text ?? '',
        post.mentionees ?? []
      );
      getMentionUsers(post.mentionees ?? []);
      setMentionsPosition(mentionPositions);
    } else {
      setInitialText(post?.data?.text ?? '');
    }
  }, [getMentionPositions, getMentionUsers, post]);

  const onPressClose = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onClose = useCallback(() => {
    Alert.alert(
      'Discard this post',
      'The post will be permanently deleted. It cannot be undone',
      [
        { text: 'Keep Editing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => onPressClose(),
        },
      ]
    );
  }, [onPressClose]);

  const onPressPost = useCallback(async () => {
    Keyboard.dismiss();
    if (!isInputValid) {
      dispatch(
        showToastMessage({ toastMessage: 'Text field cannot be blank !' })
      );
      return;
    }
    dispatch(
      showToastMessage({
        toastMessage: 'Posting...',
        isLoadingToast: true,
      })
    );
    const mentionedUserIds =
      mentionUsers?.map((item) => item.id) ?? ([] as string[]);
    const files =
      chosenMediaType === mediaAttachment.image
        ? displayImages
        : chosenMediaType === mediaAttachment.video
          ? displayVideos
          : [];
    const fileIds = files.map((item) => item.fileId);
    const type: string =
      displayImages?.length > 0
        ? 'image'
        : displayVideos?.length > 0
          ? 'video'
          : 'text';
    try {
      let response;
      if (isEditMode) {
        if (deletedPostIds?.length > 0) {
          await Promise.allSettled(
            deletedPostIds.map((postId) =>
              PostRepository.deletePost(postId, false)
            )
          );
        }

        response = await editPost(
          post.postId,
          {
            text: inputMessage,
            fileIds: fileIds as string[],
          },
          type,
          mentionedUserIds.length > 0 ? mentionedUserIds : [],
          mentionsPosition
        );
      } else {
        response = await createPostToFeed(
          targetType,
          targetId,
          {
            text: inputMessage,
            fileIds: fileIds as string[],
          },
          type,
          mentionedUserIds.length > 0 ? mentionedUserIds : [],
          mentionsPosition
        );
      }
      if (!response) {
        const toastMessage = isEditMode
          ? 'Failed to edit post'
          : 'Failed to create post';
        dispatch(showToastMessage({ toastMessage: toastMessage }));
        onPressClose();
        return;
      }
      dispatch(hideToastMessage());
      if (
        targetType === 'community' &&
        (community?.postSetting === 'ADMIN_REVIEW_POST_REQUIRED' ||
          (community as Record<string, any>)?.needApprovalOnPostCreation) &&
        !isModerator
      ) {
        return Alert.alert(
          'Post submitted',
          'Your post has been submitted to the pending list. It will be reviewed by community moderator',
          [
            {
              text: 'OK',
              onPress: () => onPressClose(),
            },
          ],
          { cancelable: false }
        );
      }
      const formattedPost = await amityPostsFormatter([response]);
      if (isEditMode) {
        const updatedPost = { ...post, ...formattedPost[0] };
        dispatch(
          updateByPostId({
            postId: post?.postId,
            postDetail: { ...updatedPost },
          })
        );
      } else {
        dispatch(addPostToGlobalFeed(formattedPost[0]));
      }
      onPressClose();
      return;
    } catch (error) {
      dispatch(hideToastMessage());
      // comment out for now. will need later
      // dispatch(showToastMessage({ toastMessage: error.message }));
    }
  }, [
    addPostToGlobalFeed,
    chosenMediaType,
    community,
    deletedPostIds,
    dispatch,
    displayImages,
    displayVideos,
    hideToastMessage,
    inputMessage,
    isEditMode,
    isInputValid,
    isModerator,
    mentionUsers,
    mentionsPosition,
    onPressClose,
    post,
    showToastMessage,
    targetId,
    targetType,
    updateByPostId,
  ]);

  let tEvents = [];
  const onSwipe = useCallback(
    (touchEvent: number[]) => {
      const swipeUp = touchEvent[0] > touchEvent[touchEvent.length - 1];
      const swipeDown = touchEvent[0] < touchEvent[touchEvent.length - 1];
      setIsSwipeup((prev) => {
        if (swipeUp && !isKeyboardShowing) return true;
        if (swipeDown) return false;
        return prev;
      });
    },
    [isKeyboardShowing]
  );

  useEffect(() => {
    isKeyboardShowing && setIsSwipeup(false);
  }, [isKeyboardShowing]);
  const shouldShowDetailAttachment = !isKeyboardShowing && isSwipeup;

  const processMedia = useCallback((mediaUrls: string[]) => {
    if (!mediaUrls?.length) return null;
    const mediaObject: IDisplayImage[] = mediaUrls.map((url: string) => {
      const fileName: string = url.substring(url.lastIndexOf('/') + 1);
      return {
        url: url,
        fileName: fileName,
        fileId: '',
        isUploaded: false,
      };
    });
    return mediaObject;
  }, []);

  useEffect(() => {
    if (displayImages?.length) return setChosenMediaType(mediaAttachment.image);
    if (displayVideos?.length) return setChosenMediaType(mediaAttachment.video);
    return setChosenMediaType(null);
  }, [displayImages?.length, displayVideos?.length]);

  const pickCamera = useCallback(
    async (mediaType: 'mixed' | 'photo' | 'video') => {
      if (mediaType === 'photo' && displayImages.length === 10)
        return Alert.alert(
          'Maximum upload limit reached',
          "You've reached the upload limit of 10 images. Any additional images will not be saved."
        );
      if (mediaType === 'video' && displayVideos.length === 10)
        return Alert.alert(
          'Maximum upload limit reached',
          "You've reached the upload limit of 10 videos. Any additional videos will not be saved."
        );
      try {
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
          if (result.assets[0].type?.includes('image')) {
            const imagesArr: string[] = [];
            imagesArr.push(result.assets[0].uri as string);
            const mediaOj = processMedia(imagesArr);
            setDisplayImages((prev) => [...prev, ...mediaOj]);
          } else {
            const selectedVideos = result.assets;
            const imageUriArr: string[] = selectedVideos.map(
              (item) => item.uri
            ) as string[];
            const videosArr: string[] = [];
            const totalVideos: string[] = videosArr.concat(imageUriArr);
            const mediaOj = processMedia(totalVideos);
            setDisplayVideos((prev) => [...prev, ...mediaOj]);
          }
        }
      }
      } catch (error) {
        console.log(error);
      }
    },
    [displayImages.length, displayVideos.length, processMedia]
  );
  const onPressCamera = useCallback(async () => {
    if (displayImages.length > 0) return pickCamera('photo');
    if (displayVideos.length > 0) return pickCamera('video');
    if (Platform.OS === 'ios') return pickCamera('mixed');
    Alert.alert('Open Camera', null, [
      { text: 'Photo', onPress: async () => pickCamera('photo') },
      { text: 'Video', onPress: async () => pickCamera('video') },
    ]);
  }, [displayImages.length, displayVideos.length, pickCamera]);

  const onPressImage = useCallback(async () => {
    if (displayImages.length === 10)
      return Alert.alert(
        'Maximum upload limit reached',
        "You've reached the upload limit of 10 images. Any additional images will not be saved."
      );
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImages = result.assets;
      const imageUriArr: string[] = selectedImages.map((item) => item.uri);
      const mediaOj = processMedia(imageUriArr);
      setDisplayImages((prev) => {
        const updatedArray = [...prev, ...mediaOj];
        if (updatedArray.length > 10) {
          Alert.alert(
            'Maximum number of images exceeded',
            'Maximum number of images that can be uploaded is 10. The rest images will be discarded'
          );
          return updatedArray.slice(0, 10);
        }
        return updatedArray;
      });
    }
  }, [displayImages.length, processMedia]);

  const onPressVideo = useCallback(async () => {
    if (displayVideos.length === 10)
      return Alert.alert(
        'Maximum upload limit reached',
        "You've reached the upload limit of 10 videos. Any additional videos will not be saved."
      );
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedVideos = result.assets;
      const videoUriArr: string[] = selectedVideos.map((item) => item.uri);
      const mediaOj = processMedia(videoUriArr);
      setDisplayVideos((prev) => {
        const updatedArray = [...prev, ...mediaOj];
        if (updatedArray.length > 10) {
          Alert.alert(
            'Maximum number of videos exceeded',
            'Maximum number of videos that can be uploaded is 10. The rest videos will be discarded'
          );
          return updatedArray.slice(0, 10);
        }
        return updatedArray;
      });
    }
  }, [displayVideos.length, processMedia]);

  const handleOnCloseImage = useCallback(
    (originalPath: string, _, postId: string) => {
      setHasChangedAttachment(true);
      setDeletedPostIds((prev) => [...prev, postId]);
      setDisplayImages((prevData) => {
        const newData = prevData.filter(
          (item: IDisplayImage) => item.url !== originalPath
        );
        return newData;
      });
    },
    []
  );
  const handleOnCloseVideo = useCallback(
    (originalPath: string, _, postId: string) => {
      setHasChangedAttachment(true);
      setDeletedPostIds((prev) => [...prev, postId]);
      setDisplayVideos((prevData) => {
        const newData = prevData.filter(
          (item: IDisplayImage) => item.url !== originalPath
        );
        return newData;
      });
    },
    []
  );
  const handleOnFinishImage = useCallback(
    (fileId: string, fileUrl: string, fileName: string, index: number) => {
      setHasChangedAttachment(true);
      const imageObject: IDisplayImage = {
        url: fileUrl,
        fileId: fileId,
        fileName: fileName,
        isUploaded: true,
      };
      setDisplayImages((prevData) => {
        const newData = [...prevData];
        newData[index] = imageObject;
        return newData;
      });
    },
    []
  );
  const handleOnFinishVideo = useCallback(
    (
      fileId: string,
      fileUrl: string,
      fileName: string,
      index: number,
      _,
      thumbnail: string
    ) => {
      setHasChangedAttachment(true);
      const imageObject: IDisplayImage = {
        url: fileUrl,
        fileId: fileId,
        fileName: fileName,
        isUploaded: true,
        thumbNail: thumbnail,
      };
      setDisplayVideos((prevData) => {
        const newData = [...prevData];
        newData[index] = imageObject;
        return newData;
      });
    },
    []
  );

  const renderDetailedAttachment = useCallback(() => {
    if (isEditMode) return null;
    if (shouldShowDetailAttachment) {
      return (
        <AmityDetailedMediaAttachmentComponent
          onPressCamera={onPressCamera}
          onPressImage={onPressImage}
          onPressVideo={onPressVideo}
          chosenMediaType={chosenMediaType}
        />
      );
    }
    return (
      <AmityMediaAttachmentComponent
        onPressCamera={onPressCamera}
        onPressImage={onPressImage}
        onPressVideo={onPressVideo}
        chosenMediaType={chosenMediaType}
      />
    );
  }, [
    chosenMediaType,
    isEditMode,
    onPressCamera,
    onPressImage,
    onPressVideo,
    shouldShowDetailAttachment,
  ]);

  if (isExcluded) return null;
  return (
    <SafeAreaView
      testID={accessibilityId}
      accessibilityLabel={accessibilityId}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onClose} hitSlop={20}>
          <CloseIcon />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          onPress={onPressPost}
          disabled={!isInputValid || !checkIsEditValid()}
        >
          {isEditMode ? (
            <Text
              style={[
                styles.postBtnText,
                checkIsEditValid() && styles.activePostBtn,
              ]}
            >
              Save
            </Text>
          ) : (
            <Text
              style={[
                styles.postBtnText,
                checkIsEditValid() && styles.activePostBtn,
              ]}
            >
              Post
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputWrapper}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          nestedScrollEnabled={true}
          scrollEnabled={!isShowingSuggestion}
          keyboardShouldPersistTaps="handled"
        >
          <AmityMentionInput
            setIsShowingSuggestion={setIsShowingSuggestion}
            initialValue={initialText}
            privateCommunityId={privateCommunityId}
            multiline
            placeholder="What's going on..."
            placeholderTextColor={themeStyles.colors.baseShade3}
            mentionUsers={mentionUsers}
            setInputMessage={setInputMessage}
            setMentionUsers={setMentionUsers}
            mentionsPosition={mentionsPosition}
            setMentionsPosition={setMentionsPosition}
            isBottomMentionSuggestionsRender
          />
          <View style={styles.imageContainer}>
            {displayImages.length > 0 && (
              <FlatList
                nestedScrollEnabled={true}
                scrollEnabled={false}
                data={displayImages}
                renderItem={({ item, index }) => {
                  if (!item) return null;
                  return (
                    <LoadingImage
                      source={item.url}
                      onClose={handleOnCloseImage}
                      index={index} //TODO: Fix this without index
                      onLoadFinish={handleOnFinishImage}
                      isUploaded={item.isUploaded}
                      fileId={item.fileId}
                      fileCount={displayImages.length}
                      isEditMode={isEditMode}
                      postId={item.postId}
                      setIsUploading={setIsUploading}
                    />
                  );
                }}
                numColumns={3}
              />
            )}
            {displayVideos.length > 0 && (
              <FlatList
                data={displayVideos}
                renderItem={({ item, index }) => {
                  if (!item) return null;
                  return (
                    <LoadingVideo
                      source={item.url}
                      onClose={handleOnCloseVideo}
                      index={index} //TODO: Fix this without index
                      onLoadFinish={handleOnFinishVideo}
                      isUploaded={item.isUploaded}
                      fileId={item.fileId}
                      thumbNail={item.thumbNail as string}
                      fileCount={displayVideos.length}
                      isEditMode={isEditMode}
                      postId={item.postId}
                      setIsUploading={setIsUploading}
                    />
                  );
                }}
                numColumns={3}
              />
            )}
          </View>
        </ScrollView>
        <View
          onTouchStart={() => {
            tEvents = [];
          }}
          onTouchMove={(a) => {
            tEvents.push(a.nativeEvent.locationY);
            onSwipe(tEvents);
          }}
        >
          {renderDetailedAttachment()}
        </View>
      </KeyboardAvoidingView>
      <StatusBar backgroundColor={themeStyles.colors.background} />
    </SafeAreaView>
  );
};

export default memo(AmityPostComposerPage);
