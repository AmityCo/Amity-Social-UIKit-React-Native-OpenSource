import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  ActivityIndicator,
  FlatList,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from 'react-native';
import Image from 'react-native-image-progress';
import { SvgXml } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  arrowDown,
  cameraIcon,
  closeIcon,
  galleryIcon,
  playVideoIcon,
} from '../../../svg/svg-xml-list';
import { styles } from './styles';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import LoadingImage from '../../../components/LoadingImage';
import { createPostToFeed } from '../../../providers/Social/feed-sdk';
import LoadingVideo from '../../../components/LoadingVideo';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Video, ResizeMode } from 'expo-av';

export interface Action {
  title: string;
  type: 'capture' | 'library';
  options: CameraOptions | ImageLibraryOptions;
}
const actions: Action[] = [
  {
    title: 'Take Image',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    },
  },
  {
    title: 'Select Image',
    type: 'library',
    options: {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    },
  },
];
export interface IDisplayImage {
  url: string;
  fileId: string | undefined;
  fileName: string;
  isUploaded: boolean;
  thumbNail?: string;
}
const CreatePost = ({ route }: any) => {
  const { targetId, targetType, targetName } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [inputMessage, setInputMessage] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [imageMultipleUri, setImageMultipleUri] = useState<string[]>([]);
  const [videoMultipleUri, setVideoMultipleUri] = useState<string[]>([]);
  // console.log('videoMultipleUri: ', videoMultipleUri);
  // console.log('imageMultipleUri: ', imageMultipleUri);
  const [displayImages, setDisplayImages] = useState<IDisplayImage[]>([]);
  console.log('displayImages: ', displayImages);
  const [displayVideos, setDisplayVideos] = useState<IDisplayImage[]>([]);
  const [playVideoUrl, setPlayVideoUrl] = useState<string>('');
  console.log('displayVideos: ', displayVideos);
  console.log('displayImages: ', displayImages);
  const imageUriRef = useRef(imageUri);
  const videoRef = React.useRef(null);

  const playVideoFullScreen = async (fileUrl: string) => {
    setPlayVideoUrl(fileUrl);
    setTimeout(async () => {
      if (videoRef) {
        await (
          videoRef as React.MutableRefObject<any>
        ).current.presentFullscreenPlayer();
        await (videoRef as React.MutableRefObject<any>).current.playAsync()();
      }
    }, 100);
  };
  const goBack = () => {
    navigation.navigate('Home');
  };
  navigation.setOptions({
    // eslint-disable-next-line react/no-unstable-nested-components
    header: () => (
      <SafeAreaView style={styles.barContainer} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={goBack}>
            <SvgXml xml={closeIcon} width="17" height="17" />
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
    ),
    headerTitle: '',
  });
  const handleCreatePost = async () => {
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
        type
      );
      if (response) {
        navigation.navigate('Home');
      }
      console.log('response: ', response);
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
        type
      );
      if (response) {
        navigation.navigate('Home');
      }
    }
  };
  const uploadImageByCamera = useCallback(async () => {
    if (imageUri) {
      console.log('imageUri: ', imageUri);
    }
  }, [imageUri]);
  useEffect(() => {
    uploadImageByCamera();
  }, [imageUri, uploadImageByCamera]);

  const openCamera = async () => {
    await launchCamera(
      [0] as unknown as CameraOptions,
      (response: ImagePickerResponse) => {
        if (!response.didCancel && !response.errorCode) {
          if (response.assets) {
            imageUriRef.current = (
              response.assets[0] as Record<string, any>
            ).uri;
            setImageUri((response.assets[0] as Record<string, any>).uri);
          }
        }
      }
    );
  };
  const pickCamera = async () => {
    // No permissions request is necessary for launching the image library
    if (Constants.appOwnership === 'expo') {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.granted) {
        let result: ImagePicker.ImagePickerResult =
          await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
          });

        console.log(result);
        console.log('result: ', result);
        if (
          result.assets &&
          result.assets.length > 0 &&
          result.assets[0] !== null &&
          result.assets[0]
        ) {
          // imageUriRef.current = result && result.assets[0].uri;
          const imagesArr = [...imageMultipleUri];
          imagesArr.push(result.assets[0].uri);
          setImageMultipleUri(imagesArr);
          // do something with uri
        }
      }
    } else {
      openCamera();
    }
  };
  const openImageGallery = async () => {
    await launchImageLibrary(
      actions[1] as unknown as ImageLibraryOptions,
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log(
            'ImagePicker Error: ',
            response.errorCode + ', ' + response.errorMessage
          );
        } else {
          if (response.assets) {
            imageUriRef.current = (
              response.assets[0] as Record<string, any>
            ).uri;
            setImageUri((response.assets[0] as Record<string, any>).uri);
            // setLoadingImageUri(loadingImageUri.push(response.assets[0].uri?.toString()))

            // console.log('printing image uri ' + response.assets[0].uri);
          }
        }
      }
    );
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
      console.log('filteredDuplicate: ', filteredDuplicate);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageMultipleUri]);

  const processVideo = async () => {
    if (videoMultipleUri.length > 0 && displayVideos.length === 0) {
      const videosObject: IDisplayImage[] = await Promise.all(
        videoMultipleUri.map(async (url: string) => {
          const fileName: string = url.substring(url.lastIndexOf('/') + 1);
          const thumbnail = await VideoThumbnails.getThumbnailAsync(url);
          console.log('thumbnail: ', thumbnail);
          return {
            url: url,
            fileName: fileName,
            fileId: '',
            isUploaded: false,
            thumbNail: thumbnail.uri,
          };
        })
      );
      setDisplayVideos((prev) => [...prev, ...videosObject]);
    } else if (videoMultipleUri.length > 0 && displayVideos.length > 0) {
      const filteredDuplicate = videoMultipleUri.filter((url: string) => {
        const fileName: string = url.substring(url.lastIndexOf('/') + 1);
        return !displayVideos.some((item) => item.fileName === fileName);
      });
      console.log('filteredDuplicate: ', filteredDuplicate);
      const videosObject: IDisplayImage[] = await Promise.all(
        filteredDuplicate.map(async (url: string) => {
          const fileName: string = url.substring(url.lastIndexOf('/') + 1);
          const thumbnail = await VideoThumbnails.getThumbnailAsync(url);
          console.log('thumbnail: ', thumbnail);
          return {
            url: url,
            fileName: fileName,
            fileId: '',
            isUploaded: false,
            thumbNail: thumbnail.uri,
          };
        })
      );
      setDisplayVideos((prev) => [...prev, ...videosObject]);
    }
  };
  useEffect(() => {
    processVideo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoMultipleUri]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    if (Constants.appOwnership === 'expo') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        allowsMultipleSelection: true,
      });

      console.log(result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImages = result.assets;
        const imageUriArr: string[] = selectedImages.map((item) => item.uri);
        console.log('imageUriArr: ', imageUriArr);
        const imagesArr = [...imageMultipleUri];
        const totalImages = imagesArr.concat(imageUriArr);
        console.log('imagesArr: ', imagesArr);
        setImageMultipleUri(totalImages);
      }
    } else {
      openImageGallery();
    }
  };
  const pickVideo = async () => {
    // No permissions request is necessary for launching the image library
    if (Constants.appOwnership === 'expo') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
        allowsMultipleSelection: true,
      });

      console.log(result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('result: ', result);
        const selectedVideos = result.assets;
        console.log('selectedVideos: ', selectedVideos);
        const imageUriArr: string[] = selectedVideos.map((item) => item.uri);
        console.log('imageUriArr: ', imageUriArr);
        const videosArr = [...videoMultipleUri];
        const totalVideos = videosArr.concat(imageUriArr);
        setVideoMultipleUri(totalVideos);

        // const newRefs = selectedImages.map((image) => useRef(image.uri));
        // imageUriRefs.current = newRefs;
        // imageUriRefs.current.forEach((ref, index) => {
        //   console.log(`Image ${index + 1}: ${ref.current}`);
        // });
        // setImageUri(result.assets[0].uri);
      }
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
    // setImageMultipleUri((prevData) => {
    //   const newData = [...prevData];
    //   newData.splice(index, 1);
    //   return newData;
    // });
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
    // setImageMultipleUri((prevData) => {
    //   const newData = [...prevData];
    //   newData.splice(index, 1);
    //   return newData;
    // });
  };

  return (
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
                    onPlay={playVideoFullScreen}
                  />
                )}
                numColumns={3}
              />
            )}
          </View>
        </ScrollView>

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
        </View>
      </KeyboardAvoidingView>
      <View style={styles.videoContainer}>
        <Video
          source={{
            uri: playVideoUrl,
          }}
          ref={videoRef}
          resizeMode={ResizeMode.CONTAIN}
        />
      </View>
    </View>
  );
};

export default CreatePost;
