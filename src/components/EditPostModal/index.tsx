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
import { editPost } from '../../providers/Social/feed-sdk';
import LoadingImage from '../LoadingImage';
import LoadingVideo from '../LoadingVideo';
import type { IPost, IVideoPost } from '../Social/PostList';
import useAuth from '../../hooks/useAuth';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
interface IModal {
  visible: boolean;
  userId?: string;
  onClose: () => void;
  onFinishEdit: (postData: { text: string, mediaUrls: string[] | IVideoPost[] }, type: string) => void;
  postDetail: IPost;
  videoPosts?: IVideoPost[];
  imagePosts?: string[];
}
const EditPostModal = ({ visible, onClose, postDetail, videoPosts = [], imagePosts = [], onFinishEdit }: IModal) => {
  const theme = useTheme() as MyMD3Theme;
  const styles =getStyles()
  const { apiRegion } = useAuth();

  const [inputMessage, setInputMessage] = useState(postDetail?.data?.text ?? '');

  const [videoPostList, setVideoPostList] = useState<IVideoPost[]>([])
  const [displayImages, setDisplayImages] = useState<IDisplayImage[]>([]);
  const [displayVideos, setDisplayVideos] = useState<IDisplayImage[]>([]);



  const handleEditPost = async () => {
    if (displayImages.length > 0) {
      const fileIdArr: (string | undefined)[] = displayImages.map(
        (item) => item.fileId
      );

      const imageUrls: string[] = displayImages.map(
        (item) => item.url
      );
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
        onFinishEdit && onFinishEdit({
          text: inputMessage,
          mediaUrls: imageUrls,
        },
          type)
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
        onFinishEdit && onFinishEdit({
          text: inputMessage,
          mediaUrls: videoPostList,
        },
          type)
      }
    }
  };



  useEffect(() => {
    if (imagePosts.length > 0) {
      const imagesObject: IDisplayImage[] = imagePosts.map(
        (url: string) => {
          const parts = url.split("/");
          const fileId = parts[parts.indexOf("files") + 1];

          return {
            url: url,
            fileName: fileId as string,
            fileId: fileId,
            isUploaded: true,
          };
        }
      );
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
    if(videoPosts.length>0){
      setVideoPostList(videoPosts)
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
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <SvgXml xml={closeIcon(theme.colors.base)} width="17" height="17" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Edit Post</Text>
        </View>
        <TouchableOpacity onPress={handleEditPost} style={styles.headerTextContainer}>
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
            {/* 
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
              <SvgXml xml={arrowDown} width="20" height="20" />
            </TouchableOpacity>
          </View> */}
          </KeyboardAvoidingView>


        </View>
      </View>
    </Modal>
  );
};

export default EditPostModal;

