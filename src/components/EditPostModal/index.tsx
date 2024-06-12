/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { useStyles } from './styles';
import type { IDisplayImage, IMentionPosition } from '../../screens/CreatePost';
import { editPost, getPostById } from '../../providers/Social/feed-sdk';
import LoadingImage from '../LoadingImage';
import LoadingVideo from '../LoadingVideo';
import type { IPost, IVideoPost } from '../Social/PostList';
import useAuth from '../../hooks/useAuth';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { PostRepository, UserRepository } from '@amityco/ts-sdk-react-native';
import { amityPostsFormatter } from '../../util/postDataFormatter';
import postDetailSlice from '../../redux/slices/postDetailSlice';
import globalFeedSlice from '../../redux/slices/globalfeedSlice';
import { useDispatch } from 'react-redux';
import MentionInput from '../MentionInput/AmityMentionInput';
import { TSearchItem } from '../../hooks/useSearch';

import CloseIcon from '../../svg/CloseIcon';
interface IModal {
  visible: boolean;
  userId?: string;
  onClose: () => void;
  onFinishEdit: (
    postData: { text: string; mediaUrls: string[] | IVideoPost[] },
    type: string
  ) => void;
  postDetail: IPost;
  videoPostsArr?: IVideoPost[];
  imagePostsArr?: string[];
  privateCommunityId: string | null;
}
const EditPostModal = ({
  visible,
  onClose,
  postDetail,
  onFinishEdit,
  privateCommunityId,
}: IModal) => {
  const theme = useTheme() as MyMD3Theme;
  const styles = useStyles();
  const { apiRegion } = useAuth();

  const [inputMessage, setInputMessage] = useState(
    postDetail?.data?.text ?? ''
  );

  const [videoPostList, setVideoPostList] = useState<IVideoPost[]>([]);
  const [displayImages, setDisplayImages] = useState<IDisplayImage[]>([]);
  const [displayVideos, setDisplayVideos] = useState<IDisplayImage[]>([]);
  const [mentionPosition, setMentionPosition] = useState<IMentionPosition[]>(
    []
  );
  const [mentionUsers, setMentionUsers] = useState<TSearchItem[]>([]);
  const [imagePosts, setImagePosts] = useState<string[]>([]);
  const [videoPosts, setVideoPosts] = useState<IVideoPost[]>([]);

  const [childrenPostArr, setChildrenPostArr] = useState<string[]>([]);
  const [initialText, setInitialText] = useState('');
  const { updateByPostId } = globalFeedSlice.actions;
  const { updatePostDetail } = postDetailSlice.actions;
  const dispatch = useDispatch();

  const parsePostText = useCallback(
    (text: string, mentionUsersArr: TSearchItem[]) => {
      const parsedText = text.replace(/@([\w\s-]+)/g, (_, username) => {
        const mentionee = mentionUsersArr.find(
          (user) => user.displayName === username
        );
        const mentioneeId = mentionee ? mentionee.userId : ''; // Get userId from mentionUsers array based on userName
        return `@[${username}](${mentioneeId})`;
      });
      return parsedText;
    },
    []
  );

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

  const getMentionUsers = useCallback(async (mentionIds: string[]) => {
    const { data } = await UserRepository.getUserByIds(mentionIds);
    const users = data.map((user) => {
      return {
        ...user,
        name: user.displayName,
        id: user.userId,
      };
    }) as TSearchItem[];

    setMentionUsers(users);
    const parsedText = parsePostText(postDetail?.data?.text ?? '', users);
    setInitialText(parsedText);
    return users;
  }, []);

  const getPostInfo = useCallback(
    async (postArray: string[]) => {
      try {
        const response = await Promise.all(
          postArray.map(async (id: string) => {
            const { data: post } = await getPostById(id);
            return { dataType: post.dataType, data: post.data };
          })
        );

        response.forEach((item) => {
          if (item.dataType === 'image') {
            setImagePosts((prev) => [
              ...prev,
              `https://api.${apiRegion}.amity.co/api/v3/files/${item?.data.fileId}/download?size=medium`,
            ]);
          } else if (item.dataType === 'video') {
            setVideoPosts((prev) => [...prev, item.data]);
          }
        });
      } catch (error) {
        console.log('error: ', error);
      }
    },
    [apiRegion]
  );

  useEffect(() => {
    if (childrenPostArr.length > 0) {
      getPostInfo(childrenPostArr);
    }
  }, [childrenPostArr, getPostInfo]);

  useEffect(() => {
    getPost(postDetail.postId);
  }, [postDetail.postId, visible]);

  useEffect(() => {
    if (postDetail?.mentionees?.length > 0) {
      const mentionPositions = getMentionPositions(
        postDetail?.data?.text ?? '',
        postDetail.mentionees ?? []
      );
      getMentionUsers(postDetail.mentionees ?? []);
      setMentionPosition(mentionPositions);
    } else {
      setInitialText(postDetail?.data?.text ?? '');
    }
  }, [postDetail]);

  const getPost = (postId: string) => {
    const unsubscribePost = PostRepository.getPost(postId, async ({ data }) => {
      setChildrenPostArr(data.children);
    });
    unsubscribePost();
  };
  const handleOnClose = () => {
    onClose && onClose();
  };

  const handleEditPost = async () => {
    const mentionees = mentionUsers.map((user) => user.id);
    if (displayImages.length > 0) {
      const fileIdArr: (string | undefined)[] = displayImages.map(
        (item) => item.fileId
      );

      const imageUrls: string[] = displayImages.map((item) => item.url);
      const type: string = displayImages.length > 0 ? 'image' : 'text';
      const response = await editPost(
        postDetail.postId,
        {
          text: inputMessage,
          fileIds: fileIdArr as string[],
        },
        type,
        mentionees,
        mentionPosition
      );
      if (response) {
        const formattedPost = await amityPostsFormatter([response]);
        dispatch(
          updateByPostId({
            postId: postDetail.postId,
            postDetail: formattedPost[0],
          })
        );
        dispatch(updatePostDetail(formattedPost[0]));
        onFinishEdit &&
          onFinishEdit(
            {
              text: inputMessage,
              mediaUrls: imageUrls,
            },
            type
          );
      }
    } else {
      const fileIdArr: (string | undefined)[] = displayVideos.map(
        (item) => item.fileId
      );
      const type: string = displayVideos.length > 0 ? 'video' : 'text';
      const response = await editPost(
        postDetail.postId,
        {
          text: inputMessage,
          fileIds: fileIdArr as string[],
        },
        type,
        mentionees,
        mentionPosition
      );
      if (response) {
        onFinishEdit &&
          onFinishEdit(
            {
              text: inputMessage,
              mediaUrls: videoPostList,
            },
            type
          );
        handleOnClose();
      }
    }
  };

  useEffect(() => {
    if (imagePosts.length > 0) {
      const imagesObject: IDisplayImage[] = imagePosts.map((url: string) => {
        const parts = url.split('/');
        const fileId = parts[parts.indexOf('files') + 1];

        return {
          url: url,
          fileName: fileId as string,
          fileId: fileId,
          isUploaded: true,
        };
      });
      setDisplayImages(imagesObject);
    }
  }, [imagePosts]);

  const processVideo = async () => {
    if (videoPosts.length > 0) {
      const videosObject: IDisplayImage[] = await Promise.all(
        videoPosts.map(async (item: IVideoPost) => {
          return {
            url: `https://api.${apiRegion}.amity.co/api/v3/files/${item.videoFileId.original}/download`,
            fileName: item.videoFileId.original,
            fileId: item.videoFileId.original,
            isUploaded: true,
            thumbNail: `https://api.${apiRegion}.amity.co/api/v3/files/${item.thumbnailFileId}/download`,
          };
        })
      );
      setDisplayVideos(videosObject);
    }
  };
  useEffect(() => {
    processVideo();
    if (videoPosts.length > 0) {
      setVideoPostList(videoPosts);
    }
  }, [videoPosts]);

  const handleOnCloseImage = (originalPath: string) => {
    setDisplayImages((prevData) => {
      const newData = prevData.filter(
        (item: IDisplayImage) => item.url !== originalPath
      ); // Filter out objects containing the desired value
      return newData; // Remove the element at the specified index
    });
  };
  const handleOnCloseVideo = (originalPath: string, fileId: string) => {
    setDisplayVideos((prevData) => {
      const newData = prevData.filter(
        (item: IDisplayImage) => item.url !== originalPath
      ); // Filter out objects containing the desired value
      return newData; // Remove the element at the specified index
    });
    setVideoPostList((prevData) => {
      const newData = prevData.filter(
        (item: IVideoPost) => item.videoFileId.original !== fileId
      ); // Filter out objects containing the desired value
      return newData; // Remove the element at the specified index
    });
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleOnClose}>
          <CloseIcon color={theme.colors.base} width={17} height={17}/>
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Edit Post</Text>
        </View>
        <TouchableOpacity
          onPress={handleEditPost}
          style={styles.headerTextContainer}
        >
          <Text style={styles.headerText}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.AllInputWrap}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.select({ ios: 100, android: 80 })}
            style={styles.AllInputWrap}
          >
            <ScrollView
              style={styles.container}
              keyboardShouldPersistTaps="handled"
            >
              <MentionInput
                style={styles.textInput}
                isBottomMentionSuggestionsRender={true}
                placeholder="What's going on...?"
                placeholderTextColor={theme.colors.baseShade3}
                setInputMessage={setInputMessage}
                mentionUsers={mentionUsers}
                setMentionUsers={setMentionUsers}
                mentionsPosition={mentionPosition}
                setMentionsPosition={setMentionPosition}
                multiline
                privateCommunityId={privateCommunityId}
                initialValue={initialText}
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
                        isUploaded={item.isUploaded}
                        fileId={item.fileId}
                        isEditMode
                      />
                    )}
                    extraData={displayImages}
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
                        isUploaded={item.isUploaded}
                        fileId={item.fileId}
                        thumbNail={item.thumbNail as string}
                        isEditMode
                      />
                    )}
                    numColumns={3}
                  />
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

export default memo(EditPostModal);
