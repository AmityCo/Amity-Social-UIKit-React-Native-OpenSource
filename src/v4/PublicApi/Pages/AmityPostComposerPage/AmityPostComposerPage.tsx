import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  NativeTouchEvent,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { ComponentID, ElementID, PageID, mediaAttachment } from '../../../enum';
import {
  TSearchItem,
  useAmityPage,
  useIsCommunityModerator,
} from '../../../hook';
import { useStyles } from './styles';
import { AmityPostComposerPageType } from '../../types';
import AmityMentionInput from '../../../component/MentionInput/AmityMentionInput';
import { IDisplayImage, IMentionPosition } from '~/v4/types/type';
import CloseButtonIconElement from '../../Elements/CloseButtonIconElement/CloseButtonIconElement';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import uiSlice from '../../../../redux/slices/uiSlice';
import { amityPostsFormatter } from '../../../../util/postDataFormatter';
import useAuth from '../../../../hooks/useAuth';
import globalfeedSlice from '../../../../redux/slices/globalfeedSlice';
import { createPostToFeed } from '../../../../providers/Social/feed-sdk';
import TextKeyElement from '../../Elements/TextKeyElement/TextKeyElement';
import AmityMediaAttachmentComponent from '../../Components/AmityMediaAttachmentComponent/AmityMediaAttachmentComponent';
import AmityDetailedMediaAttachmentComponent from '../../Components/AmityDetailedMediaAttachmentComponent/AmityDetailedMediaAttachmentComponent';
import { useKeyboardStatus } from '../../../hook';
import ImagePicker, {
  launchImageLibrary,
  type Asset,
  launchCamera,
} from 'react-native-image-picker';
import LoadingImage from '../../../component/LoadingImage';
import LoadingVideo from '../../../component/LoadingVideo';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/RouteParamList';

const AmityPostComposerPage: FC<AmityPostComposerPageType> = ({
  targetId,
  targetType,
  community,
}) => {
  const pageId = PageID.post_composer_page;
  const { isExcluded, themeStyles, accessibilityId } = useAmityPage({ pageId });
  const styles = useStyles(themeStyles);
  const { isKeyboardShowing } = useKeyboardStatus();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { client } = useAuth();
  const dispatch = useDispatch();
  const { addPostToGlobalFeed } = globalfeedSlice.actions;
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
  const [isSwipeup, setIsSwipeup] = useState(false); //will use in next PR
  const privateCommunityId = !community?.isPublic && community?.communityId;
  const title = community?.displayName ?? 'My Timeline';
  const isInputValid =
    inputMessage.trim().length > 0 && inputMessage.trim().length <= 50000;
  const onPressClose = useCallback(() => {
    navigation.pop(2);
  }, [navigation]);

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
      const response = await createPostToFeed(
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
      if (!response) {
        dispatch(showToastMessage({ toastMessage: 'Failed to create post' }));
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
      dispatch(addPostToGlobalFeed(formattedPost[0]));
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
    dispatch,
    displayImages,
    displayVideos,
    hideToastMessage,
    inputMessage,
    isInputValid,
    isModerator,
    mentionUsers,
    mentionsPosition,
    onPressClose,
    showToastMessage,
    targetId,
    targetType,
  ]);

  const onSwipe = (touchEvent: NativeTouchEvent) => {
    const swipeUp = touchEvent.locationY < -50;
    const swipeDown = touchEvent.locationY > 50;
    setIsSwipeup((prev) => {
      if (swipeUp && !isKeyboardShowing) return true;
      if (swipeDown) return false;
      return prev;
    });
  };

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
      const result: ImagePicker.ImagePickerResponse = await launchCamera({
        mediaType: mediaType,
        quality: 1,
        presentationStyle: 'fullScreen',
        videoQuality: 'high',
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
          const selectedVideos: Asset[] = result.assets;
          const imageUriArr: string[] = selectedVideos.map(
            (item: Asset) => item.uri
          ) as string[];
          const videosArr: string[] = [];
          const totalVideos: string[] = videosArr.concat(imageUriArr);
          const mediaOj = processMedia(totalVideos);
          setDisplayVideos((prev) => [...prev, ...mediaOj]);
        }
      }
    },
    [processMedia]
  );
  const onPressCamera = useCallback(async () => {
    if (Platform.OS === 'ios') return pickCamera('mixed');
    Alert.alert('Open Camera', null, [
      { text: 'Photo', onPress: async () => await pickCamera('photo') },
      { text: 'Video', onPress: async () => await pickCamera('video') },
    ]);
  }, [pickCamera]);

  const onPressImage = useCallback(async () => {
    const result: ImagePicker.ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 10,
    });
    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const imageUriArr: string[] = result.assets.map(
        (item: Asset) => item.uri
      ) as string[];
      const mediaOj = processMedia(imageUriArr);
      setDisplayImages((prev) => [...prev, ...mediaOj]);
    }
  }, [processMedia]);

  const onPressVideo = useCallback(async () => {
    const result: ImagePicker.ImagePickerResponse = await launchImageLibrary({
      mediaType: 'video',
      quality: 1,
      selectionLimit: 10,
    });
    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const videoUriArr: string[] = result.assets.map(
        (item: Asset) => item.uri
      ) as string[];
      const mediaOj = processMedia(videoUriArr);
      setDisplayVideos((prev) => [...prev, ...mediaOj]);
    }
  }, [processMedia]);

  const handleOnCloseImage = useCallback((originalPath: string) => {
    setDisplayImages((prevData) => {
      const newData = prevData.filter(
        (item: IDisplayImage) => item.url !== originalPath
      ); // Filter out objects containing the desired value
      return newData; // Remove the element at the specified index
    });
  }, []);
  const handleOnCloseVideo = useCallback((originalPath: string) => {
    setDisplayVideos((prevData) => {
      const newData = prevData.filter(
        (item: IDisplayImage) => item.url !== originalPath
      ); // Filter out objects containing the desired value
      return newData; // Remove the element at the specified index
    });
  }, []);
  const handleOnFinishImage = useCallback(
    (fileId: string, fileUrl: string, fileName: string, index: number) => {
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
  if (isExcluded) return null;
  return (
    <SafeAreaView
      testID={accessibilityId}
      accessibilityLabel={accessibilityId}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onPressClose} hitSlop={20}>
          <CloseButtonIconElement pageID={pageId} style={styles.closeBtn} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onPressPost}>
          <TextKeyElement
            pageID={pageId}
            componentID={ComponentID.WildCardComponent}
            elementID={ElementID.create_new_post_button}
            style={[styles.postBtnText, isInputValid && styles.activePostBtn]}
          />
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
            autoFocus
            initialValue=""
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
                data={displayImages}
                renderItem={({ item, index }) => (
                  <LoadingImage
                    source={item.url}
                    onClose={handleOnCloseImage}
                    index={index}
                    onLoadFinish={handleOnFinishImage}
                    isUploaded={item.isUploaded}
                    fileId={item.fileId}
                    fileCount={displayImages.length}
                  />
                )}
                numColumns={3}
              />
            )}
            {displayVideos.length > 0 && (
              <FlatList
                data={displayVideos}
                renderItem={({ item, index }) => (
                  <LoadingVideo
                    source={item.url}
                    onClose={handleOnCloseVideo}
                    index={index}
                    onLoadFinish={handleOnFinishVideo}
                    isUploaded={item.isUploaded}
                    fileId={item.fileId}
                    thumbNail={item.thumbNail as string}
                    fileCount={displayVideos.length}
                  />
                )}
                numColumns={3}
              />
            )}
          </View>
        </ScrollView>
        <View
          onTouchEndCapture={(a) => {
            onSwipe(a?.nativeEvent?.changedTouches[0]);
          }}
        >
          {shouldShowDetailAttachment ? (
            <AmityDetailedMediaAttachmentComponent
              onPressCamera={onPressCamera}
              onPressImage={onPressImage}
              onPressVideo={onPressVideo}
              chosenMediaType={chosenMediaType}
            />
          ) : (
            <AmityMediaAttachmentComponent
              onPressCamera={onPressCamera}
              onPressImage={onPressImage}
              onPressVideo={onPressVideo}
              chosenMediaType={chosenMediaType}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AmityPostComposerPage;
