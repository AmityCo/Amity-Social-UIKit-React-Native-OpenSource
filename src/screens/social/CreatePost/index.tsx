import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  Image,
  ActivityIndicator,
  FlatList,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from 'react-native';
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
import BackButton from '../../../components/BackButton';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
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
const CreatePost = ({ route }: any) => {
  const { communityId, communityName } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [imageUri, setImageUri] = useState<string | undefined>();
  const [imageMultipleUri, setImageMultipleUri] = useState<
    string[] | undefined
  >([]);
  console.log('imageMultipleUri: ', imageMultipleUri);
  const imageUriRef = useRef(imageUri);
  console.log('imageUriRef: ', imageUriRef);
  const imageUriRefs = useRef(imageMultipleUri);

  const goBack = () => {
    navigation.navigate('Home', { isOpenModal: true });
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
            <Text style={styles.headerText}>{communityName}</Text>
          </View>
        </View>
      </SafeAreaView>
    ),
    headerTitle: '',
  });
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
          imageUriRef.current = result && result.assets[0].uri;
          setImageUri(result.assets[0].uri);
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
        setImageMultipleUri(imageMultipleUri)
        // const newRefs = selectedImages.map((image) => useRef(image.uri));
        // imageUriRefs.current = newRefs;
        // imageUriRefs.current.forEach((ref, index) => {
        //   console.log(`Image ${index + 1}: ${ref.current}`);
        // });
        // setImageUri(result.assets[0].uri);
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
        const selectedImages = result.assets;
        console.log('selectedImages: ', selectedImages);
        // const newRefs = selectedImages.map((image) => useRef(image.uri));
        // imageUriRefs.current = newRefs;
        // imageUriRefs.current.forEach((ref, index) => {
        //   console.log(`Image ${index + 1}: ${ref.current}`);
        // });
        // setImageUri(result.assets[0].uri);
      }
    }
  };
  return (
    <View style={styles.AllInputWrap}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 80, android: 80 })}
        style={styles.AllInputWrap}
      >
        <ScrollView style={styles.container}>
          <TextInput
            multiline
            placeholder="What's going on..."
            style={styles.textInput}
          />
        </ScrollView>

        <View style={styles.InputWrap}>
          <TouchableOpacity onPress={pickCamera}>
            <View style={styles.iconWrap}>
              <SvgXml xml={cameraIcon} width="27" height="27" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.iconWrap}>
              <SvgXml xml={galleryIcon} width="27" height="27" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickVideo}>
            <View style={styles.iconWrap}>
              <SvgXml xml={playVideoIcon} width="27" height="27" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Keyboard.dismiss()}>
            <SvgXml xml={arrowDown} width="20" height="20" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreatePost;
