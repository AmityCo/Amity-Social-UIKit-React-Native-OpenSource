import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { arrowOutlined, closeIcon } from '../../svg/svg-xml-list';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './styles';
import ChooseCategoryModal from '../../components/ChooseCategoryModal';

export default function CreateCommunity() {

  const [image, setImage] = useState<string>();
  const [communityName, setCommunityName] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  console.log('categoryId:', categoryId)
  const [aboutText, setAboutText] = useState('');
  const [categoryModal, setCategoryModal] = useState<boolean>(false)
  const MAX_COMMUNITY_NAME_LENGTH = 30;
  const MAX_ABOUT_TEXT_LENGTH = 180;

  console.log('image:', image)
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onClickBack = () => {
    navigation.goBack()
  };
  navigation.setOptions({
    // eslint-disable-next-line react/no-unstable-nested-components
    headerLeft: () => (<TouchableOpacity onPress={onClickBack} style={styles.btnWrap}>
      <SvgXml xml={closeIcon} width="15" height="15" />
    </TouchableOpacity>),

    headerTitle: 'Create Community',
  });



  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });


    if (!result.canceled && result.assets &&
      result.assets.length > 0 &&
      result.assets[0] !== null &&
      result.assets[0]) {
      setImage(result.assets[0]?.uri);
    }
  };

  const handleSelectCategory = (categoryId: string, categoryName: string) => {
    console.log('categoryName:', categoryName)
    console.log('categoryId:', categoryId)
    setCategoryId(categoryId);
    setCategoryName(categoryName);
  }
  return (
    <ScrollView style={styles.container}>
      <View >
        <View style={styles.uploadContainer}>

          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View
              style={styles.defaultImage}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={pickImage}>
            {/* You can use any icon library here or just text */}
            {/* For example, you can use an icon like: <YourIconName size={24} color="white" /> */}
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
                {communityName.length}/{MAX_COMMUNITY_NAME_LENGTH}
              </Text>
            </View>

            <TextInput
              style={styles.inputField}
              placeholder="Name your community"
              placeholderTextColor="#A5A9B5"
              value={communityName}
              onChangeText={text => setCommunityName(text)}
              maxLength={MAX_COMMUNITY_NAME_LENGTH}
            />

          </View>

          <View style={styles.inputContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.inputTitle}>About text</Text>
              <Text style={styles.inputLengthMeasure}>
                {aboutText.length}/{MAX_ABOUT_TEXT_LENGTH}
              </Text>
            </View>

            <TextInput
              style={styles.inputField}
              placeholder="Enter description"
              placeholderTextColor="#A5A9B5"
              value={aboutText}
              onChangeText={text => setAboutText(text)}
              maxLength={MAX_ABOUT_TEXT_LENGTH}
              multiline={true}
            />


          </View>
          <View style={styles.inputContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.inputTitle}>
                Category<Text style={styles.requiredField}> *</Text>
              </Text>
            </View>
            <Pressable onPress={() => setCategoryModal(true)} style={styles.categoryContainer}>
              <Text style={!categoryName?styles.placeHolderText:[]}>{categoryName.length > 0 ? categoryName : 'Select Category'}</Text>
              <SvgXml style={styles.arrowIcon} xml={arrowOutlined} width={15} height={15} />
            </Pressable>
          </View>
        </View>
      </View>
      <ChooseCategoryModal onSelect={handleSelectCategory} onClose={() => setCategoryModal(false)} visible={categoryModal} />
    </ScrollView>
  );
}
