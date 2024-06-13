import { useState, useRef } from 'react';
import { Alert } from 'react-native';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';

type UseImagePickerType = {
  imageUri: string | null;
  removeSelectedImage: () => void;
  openImageGallery: () => Promise<void>;
};

const useImagePicker = (options: ImageLibraryOptions): UseImagePickerType => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const imageUriRef = useRef<string | null>(null);

  const openImageGallery = async () => {
    await launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert(
          'ImagePicker Error:',
          response.errorCode + ', ' + response.errorMessage
        );
      } else {
        if (response.assets) {
          imageUriRef.current = response.assets[0].uri;
          setImageUri(response.assets[0].uri);
        }
      }
    });
  };

  const removeSelectedImage = () => {
    setImageUri(null);
  };

  return { imageUri, removeSelectedImage, openImageGallery };
};

export default useImagePicker;
