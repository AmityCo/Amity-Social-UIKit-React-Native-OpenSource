import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { closeIcon } from '../../svg/svg-xml-list';

import { getStyles } from './styles';
import type { IDisplayImage } from '../../screens/CreatePost';
import { editPost, getPostById } from '../../providers/Social/feed-sdk';
import LoadingImage from '../LoadingImage';
import LoadingVideo from '../LoadingVideo';
import type { IPost, IVideoPost } from '../Social/PostList';
import useAuth from '../../hooks/useAuth';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { PostRepository } from '@amityco/ts-sdk-react-native';
import { amityPostsFormatter } from '../../util/postDataFormatter';
import postDetailSlice from '../../redux/slices/postDetailSlice';
import globalFeedSlice from '../../redux/slices/globalfeedSlice';
import { useDispatch } from 'react-redux';
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
}
const EditPostModal = ({
  visible,
  onClose,
  postDetail,
  onFinishEdit,
}: IModal) => {
  const theme = useTheme() as MyMD3Theme;
  const styles = getStyles();
  const { apiRegion } = useAuth();

  const [inputMessage, setInputMessage] = useState(
    postDetail?.data?.text ?? ''
  );

  const [videoPostList, setVideoPostList] = useState<IVideoPost[]>([]);
  const [displayImages, setDisplayImages] = useState<IDisplayImage[]>([]);
  const [displayVideos, setDisplayVideos] = useState<IDisplayImage[]>([]);

  const [imagePosts, setImagePosts] = useState<string[]>([]);
  const [videoPosts, setVideoPosts] = useState<IVideoPost[]>([]);

  const [childrenPostArr, setChildrenPostArr] = useState<string[]>([]);
  const { updateByPostId } = globalFeedSlice.actions;
  const { updatePostDetail } = postDetailSlice.actions;
  const dispatch = useDispatch();

  useEffect(() => {
    if (childrenPostArr.length > 0) {
      getPostInfo();
    }
  }, [childrenPostArr]);

  useEffect(() => {
    getPost(postDetail.postId);
  }, [postDetail.postId, visible]);

  const getPost = (postId: string) => {
    const unsubscribePost = PostRepository.getPost(postId, async ({ data }) => {
      setChildrenPostArr(data.children);
    });
    unsubscribePost();
  };
  const handleOnClose = () => {
    onClose && onClose();
  };

  const getPostInfo = async () => {
    try {
      const response = await Promise.all(
        childrenPostArr.map(async (id: string) => {
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
  };

  const handleEditPost = async () => {
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
        type
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
        type
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
          <SvgXml xml={closeIcon(theme.colors.base)} width="17" height="17" />
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
            <ScrollView style={styles.container}>
              <TextInput
                multiline
                placeholder="What's going on..."
                style={styles.textInput}
                value={inputMessage}
                onChangeText={(text) => setInputMessage(text)}
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

export default EditPostModal;
