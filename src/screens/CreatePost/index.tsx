/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  FlatList,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Alert,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  arrowDown,
  cameraIcon,
  closeIcon,
  galleryIcon,
  playVideoIcon,
} from '../../svg/svg-xml-list';
import { useStyles } from './styles';
import ImagePicker, {
  launchImageLibrary,
  type Asset,
  launchCamera,
} from 'react-native-image-picker';
import LoadingImage from '../../components/LoadingImage';
import { createPostToFeed } from '../../providers/Social/feed-sdk';
import LoadingVideo from '../../components/LoadingVideo';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';
import { ISearchItem } from '../../components/SearchItem';
import MentionPopup from '../../components/MentionPopup';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import { checkCommunityPermission } from '../../providers/Social/communities-sdk';
import useAuth from '../../hooks/useAuth';

export interface IDisplayImage {
  url: string;
  fileId: string | undefined;
  fileName: string;
  isUploaded: boolean;
  thumbNail?: string;
}
export interface IMentionPosition {
  index: number;
  type: string;
  userId: string;
  length: number;
  displayName?: string;
}
const CreatePost = ({ route }: any) => {
  const theme = useTheme() as MyMD3Theme;
  const styles = useStyles();
  const { targetId, targetType, targetName } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [inputMessage, setInputMessage] = useState('');
  const [imageMultipleUri, setImageMultipleUri] = useState<string[]>([]);
  const [videoMultipleUri, setVideoMultipleUri] = useState<string[]>([]);
  const [displayImages, setDisplayImages] = useState<IDisplayImage[]>([]);
  const [displayVideos, setDisplayVideos] = useState<IDisplayImage[]>([]);
  const [isShowMention, setIsShowMention] = useState<boolean>(false);
  const [mentionNames, setMentionNames] = useState<ISearchItem[]>([]);

  const [currentSearchUserName, setCurrentSearchUserName] =
    useState<string>('');
  const [cursorIndex, setCursorIndex] = useState(0);
  const [mentionsPosition, setMentionsPosition] = useState<IMentionPosition[]>(
    []
  );

  const [communityObject, setCommunityObject] =
    useState<Amity.LiveObject<Amity.Community>>();
  const { data: community } = communityObject ?? {};

  const { client, apiRegion } = useAuth();

  const getCommunityDetail = useCallback(() => {
    if (targetType === 'community') {
      CommunityRepository.getCommunity(targetId, setCommunityObject);
    }
  }, [targetId, targetType]);
  useEffect(() => {
    getCommunityDetail();
  }, [getCommunityDetail]);

  const checkMention = useCallback(
    (inputString: string) => {
      // Check if "@" is at the first letter
      const startsWithAt = /^@/.test(inputString);

      // Check if "@" is inside the sentence without any letter before "@"
      const insideWithoutLetterBefore = /[^a-zA-Z]@/.test(inputString);

      const atSigns = inputString.match(/@/g);
      const atSignsNumber = atSigns ? atSigns.length : 0;
      if (
        (startsWithAt || insideWithoutLetterBefore) &&
        atSignsNumber > mentionNames.length
      ) {
        setIsShowMention(true);
      } else {
        setIsShowMention(false);
      }
    },
    [mentionNames.length]
  );
  useEffect(() => {
    if (isShowMention) {
      const substringBeforeCursor = inputMessage.substring(0, cursorIndex);
      const lastAtsIndex = substringBeforeCursor.lastIndexOf('@');
      if (lastAtsIndex !== -1) {
        const searchText: string = inputMessage.substring(
          lastAtsIndex + 1,
          cursorIndex + 1
        );
        setCurrentSearchUserName(searchText);
      }
    }
  }, [cursorIndex, inputMessage, isShowMention]);

  useEffect(() => {
    checkMention(inputMessage);
  }, [checkMention, inputMessage]);

  const goBack = () => {
    navigation.goBack();
  };
  const handleCreatePost = async () => {
    const mentionUserIds: string[] = mentionNames.map((item) => item.targetId);
    if (displayImages.length > 0) {
      const fileIdArr: (string | undefined)[] = displayImages.map(
        (item) => item.fileId
      );

      const type: string = displayImages.length > 0 ? 'image' : 'text';
      const response = await createPostToFeed(
        targetType,
        targetId,
        {
          text: inputMessage,
          fileIds: fileIdArr as string[],
        },
        type,
        mentionUserIds.length > 0 ? mentionUserIds : [],
        mentionsPosition
      );
      if (response) {
        goBack();
      }
    } else {
      const fileIdArr: (string | undefined)[] = displayVideos.map(
        (item) => item.fileId
      );

      const type: string = displayVideos.length > 0 ? 'video' : 'text';

      const response = await createPostToFeed(
        targetType,
        targetId,
        {
          text: inputMessage,
          fileIds: fileIdArr as string[],
        },
        type,
        mentionUserIds.length > 0 ? mentionUserIds : [],
        mentionsPosition
      );
      if (targetType === 'community') {
        if (
          (community?.postSetting === 'ADMIN_REVIEW_POST_REQUIRED' ||
            (community as Record<string, any>).needApprovalOnPostCreation) &&
          response
        ) {
          const res = await checkCommunityPermission(
            community.communityId,
            client as Amity.Client,
            apiRegion
          );

          if (
            res.permissions.length > 0 &&
            res.permissions.includes('Post/ManagePosts')
          ) {
            goBack();
          } else {
            Alert.alert(
              'Post submitted',
              'Your post has been submitted to the pending list. It will be reviewed by community moderator',
              [
                {
                  text: 'OK',
                  onPress: () => goBack(),
                },
              ],
              { cancelable: false }
            );
          }
        }
      } else {
        goBack();
      }
    }
  };

  const pickCamera = async () => {
    // const permission = await ImagePicker();

    const result: ImagePicker.ImagePickerResponse = await launchCamera({
      mediaType: 'mixed',
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
        const imagesArr: string[] = [...imageMultipleUri];
        imagesArr.push(result.assets[0].uri as string);
        setImageMultipleUri(imagesArr);
      } else {
        const selectedVideos: Asset[] = result.assets;
        const imageUriArr: string[] = selectedVideos.map(
          (item: Asset) => item.uri
        ) as string[];
        const videosArr: string[] = [...videoMultipleUri];
        const totalVideos: string[] = videosArr.concat(imageUriArr);
        setVideoMultipleUri(totalVideos);
      }
    }
  };

  useEffect(() => {
    if (imageMultipleUri.length > 0 && displayImages.length === 0) {
      const imagesObject: IDisplayImage[] = imageMultipleUri.map(
        (url: string) => {
          const fileName: string = url.substring(url.lastIndexOf('/') + 1);

          return {
            url: url,
            fileName: fileName,
            fileId: '',
            isUploaded: false,
          };
        }
      );
      setDisplayImages((prev) => [...prev, ...imagesObject]);
    } else if (imageMultipleUri.length > 0 && displayImages.length > 0) {
      const filteredDuplicate = imageMultipleUri.filter((url: string) => {
        const fileName: string = url.substring(url.lastIndexOf('/') + 1);
        return !displayImages.some((item) => item.fileName === fileName);
      });

      const imagesObject: IDisplayImage[] = filteredDuplicate.map(
        (url: string) => {
          const fileName: string = url.substring(url.lastIndexOf('/') + 1);

          return {
            url: url,
            fileName: fileName,
            fileId: '',
            isUploaded: false,
          };
        }
      );
      setDisplayImages((prev) => [...prev, ...imagesObject]);
    }
  }, [imageMultipleUri]);

  const processVideo = async () => {
    if (videoMultipleUri.length > 0 && displayVideos.length === 0) {
      const videosObject: IDisplayImage[] = await Promise.all(
        videoMultipleUri.map(async (url: string) => {
          const fileName: string = url.substring(url.lastIndexOf('/') + 1);

          return {
            url: url,
            fileName: fileName,
            fileId: '',
            isUploaded: false,
            thumbNail: '',
          };
        })
      );
      setDisplayVideos((prev) => [...prev, ...videosObject]);
    } else if (videoMultipleUri.length > 0 && displayVideos.length > 0) {
      const filteredDuplicate = videoMultipleUri.filter((url: string) => {
        const fileName: string = url.substring(url.lastIndexOf('/') + 1);
        return !displayVideos.some((item) => item.fileName === fileName);
      });
      const videosObject: IDisplayImage[] = await Promise.all(
        filteredDuplicate.map(async (url: string) => {
          const fileName: string = url.substring(url.lastIndexOf('/') + 1);
          return {
            url: url,
            fileName: fileName,
            fileId: '',
            isUploaded: false,
            thumbNail: '',
          };
        })
      );
      setDisplayVideos((prev) => [...prev, ...videosObject]);
    }
  };
  useEffect(() => {
    processVideo();
  }, [videoMultipleUri]);

  const pickImage = async () => {
    const result: ImagePicker.ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 10,
    });
    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const selectedImages: Asset[] = result.assets;
      const imageUriArr: string[] = selectedImages.map(
        (item: Asset) => item.uri
      ) as string[];
      const imagesArr = [...imageMultipleUri];
      const totalImages = imagesArr.concat(imageUriArr);
      setImageMultipleUri(totalImages);
    }
  };
  const pickVideo = async () => {
    const result: ImagePicker.ImagePickerResponse = await launchImageLibrary({
      mediaType: 'video',
      quality: 1,
      selectionLimit: 10,
    });
    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const selectedVideos: Asset[] = result.assets;
      const imageUriArr: string[] = selectedVideos.map(
        (item: Asset) => item.uri
      ) as string[];
      const videosArr = [...videoMultipleUri];
      const totalVideos = videosArr.concat(imageUriArr);
      setVideoMultipleUri(totalVideos);
    }
  };
  const handleOnCloseImage = (originalPath: string) => {
    setDisplayImages((prevData) => {
      const newData = prevData.filter(
        (item: IDisplayImage) => item.url !== originalPath
      ); // Filter out objects containing the desired value
      return newData; // Remove the element at the specified index
    });
  };
  const handleOnCloseVideo = (originalPath: string) => {
    setDisplayVideos((prevData) => {
      const newData = prevData.filter(
        (item: IDisplayImage) => item.url !== originalPath
      ); // Filter out objects containing the desired value
      return newData; // Remove the element at the specified index
    });
  };
  const handleOnFinishImage = (
    fileId: string,
    fileUrl: string,
    fileName: string,
    index: number,
    originalPath: string
  ) => {
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
    setImageMultipleUri((prevData) => {
      const newData = prevData.filter((url: string) => url !== originalPath); // Filter out objects containing the desired value
      return newData; // Update the state with the filtered array
    });
  };
  const handleOnFinishVideo = (
    fileId: string,
    fileUrl: string,
    fileName: string,
    index: number,
    originalPath: string,
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
    setVideoMultipleUri((prevData) => {
      const newData = prevData.filter((url: string) => url !== originalPath); // Filter out objects containing the desired value
      return newData; // Update the state with the filtered array
    });
  };

  const onSelectUserMention = (user: ISearchItem) => {
    const textAfterCursor: string = inputMessage.substring(
      cursorIndex,
      inputMessage.length + 1
    );
    const newTextAfterReplacement =
      inputMessage.slice(0, cursorIndex - currentSearchUserName.length) +
      user.displayName +
      inputMessage.slice(cursorIndex, inputMessage.length);
    const newInputMessage = newTextAfterReplacement + textAfterCursor;
    const position: IMentionPosition = {
      type: 'user',
      length: user.displayName.length + 1,
      index: cursorIndex - 1 - currentSearchUserName.length,
      userId: user.targetId,
      displayName: user.displayName,
    };

    setInputMessage(newInputMessage);
    setMentionNames((prev) => [...prev, user]);
    setMentionsPosition((prev) => [...prev, position]);
    setCurrentSearchUserName('');
  };
  const handleSelectionChange = (event) => {
    setCursorIndex(event.nativeEvent.selection.start);
  };

  const renderTextWithMention = () => {
    if (mentionsPosition.length === 0) {
      return <Text style={styles.inputText}>{inputMessage}</Text>;
    }

    let currentPosition = 0;
    const result: (string | JSX.Element)[][] = mentionsPosition.map(
      ({ index, length }, i) => {
        // Add non-highlighted text before the mention
        const nonHighlightedText = inputMessage.slice(currentPosition, index);

        // Add highlighted text
        const highlightedText = (
          <Text key={`highlighted-${i}`} style={styles.mentionText}>
            {inputMessage.slice(index, index + length)}
          </Text>
        );

        // Update currentPosition for the next iteration
        currentPosition = index + length;

        // Return an array of non-highlighted and highlighted text
        return [nonHighlightedText, highlightedText];
      }
    );

    // Add any remaining non-highlighted text after the mentions
    const remainingText = inputMessage.slice(currentPosition);
    result.push([
      <Text key="nonHighlighted-last" style={styles.inputText}>
        {remainingText}
      </Text>,
    ]);

    // Flatten the array and render
    return <Text style={styles.inputText}>{result.flat()}</Text>;
  };

  useEffect(() => {
    const checkMentionNames = mentionNames.filter((item) => {
      return inputMessage.includes(item.displayName);
    });
    const checkMentionPosition = mentionsPosition.filter((item) => {
      return inputMessage.includes(item.displayName as string);
    });
    setMentionNames(checkMentionNames);
    setMentionsPosition(checkMentionPosition);
  }, [inputMessage]);

  return (
    <View style={styles.AllInputWrap}>
      <SafeAreaView style={styles.barContainer} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={goBack}>
            <SvgXml xml={closeIcon(theme.colors.base)} width="17" height="17" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>{targetName}</Text>
          </View>
          <TouchableOpacity
            disabled={
              inputMessage.length > 0 ||
              displayImages.length > 0 ||
              displayVideos.length > 0
                ? false
                : true
            }
            onPress={handleCreatePost}
          >
            <Text
              style={
                inputMessage.length > 0 ||
                displayImages.length > 0 ||
                displayVideos.length > 0
                  ? styles.postText
                  : [styles.postText, styles.disabled]
              }
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 100, android: 80 })}
        style={styles.AllInputWrap}
      >
        <ScrollView style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              multiline
              placeholder="What's going on..."
              style={
                mentionNames.length > 0
                  ? [styles.textInput, styles.transparentText]
                  : styles.textInput
              }
              value={inputMessage}
              onChangeText={(text) => setInputMessage(text)}
              placeholderTextColor={theme.colors.baseShade3}
              onSelectionChange={handleSelectionChange}
            />
            {mentionNames.length > 0 && (
              <View style={styles.overlay}>{renderTextWithMention()}</View>
            )}
          </View>
          {/* <InputWithMention /> */}
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
                  />
                )}
                numColumns={3}
              />
            )}
          </View>
        </ScrollView>
        {isShowMention && (
          <MentionPopup
            userName={currentSearchUserName}
            onSelectMention={onSelectUserMention}
          />
        )}

        <View style={styles.InputWrap}>
          <TouchableOpacity
            disabled={displayVideos.length > 0 ? true : false}
            onPress={pickCamera}
          >
            <View style={styles.iconWrap}>
              <SvgXml xml={cameraIcon} width="27" height="27" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={displayVideos.length > 0 ? true : false}
            onPress={pickImage}
          >
            <View style={styles.iconWrap}>
              <SvgXml xml={galleryIcon} width="27" height="27" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={displayImages.length > 0 ? true : false}
            onPress={pickVideo}
            style={displayImages.length > 0 ? styles.disabled : []}
          >
            <View style={styles.iconWrap}>
              <SvgXml xml={playVideoIcon} width="27" height="27" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Keyboard.dismiss()}>
            <SvgXml xml={arrowDown(theme.colors.base)} width="20" height="20" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreatePost;
