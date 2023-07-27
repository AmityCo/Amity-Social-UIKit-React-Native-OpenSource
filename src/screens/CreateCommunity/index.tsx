import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { arrowOutlined, closeIcon, plusIcon, privateIcon, publicIcon } from '../../svg/svg-xml-list';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './styles';
import ChooseCategoryModal from '../../components/ChooseCategoryModal';
import { RadioButton } from 'react-native-radio-buttons-group';
import AddMembersModal from '../../components/AddMembersModal';

export default function CreateCommunity() {

  const [image, setImage] = useState<string>();
  const [communityName, setCommunityName] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  console.log('categoryId:', categoryId)
  const [aboutText, setAboutText] = useState('');
  const [categoryModal, setCategoryModal] = useState<boolean>(false)
  const [addMembersModal, setAddMembersModal] = useState<boolean>(false) 
  const [selectedId, setSelectedId] = useState<string>();
  console.log('selectedId:', selectedId)

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

  const handleAddMembers = (userIds: string[]) => {
  	console.log('userIds:', userIds)
 
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
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
              <Text style={!categoryName ? styles.placeHolderText : []}>{categoryName.length > 0 ? categoryName : 'Select Category'}</Text>
              <SvgXml style={styles.arrowIcon} xml={arrowOutlined} width={15} height={15} />
            </Pressable>
          </View>
          <View style={styles.radioGroup}>
            <Pressable onPress={() => setSelectedId('public')} style={styles.listItem}>

              <View style={styles.avatar}>
                <SvgXml
                  width={20}
                  height={20}
                  xml={publicIcon}
                />
              </View>

              <View style={styles.optionDescription}>
                <Text style={styles.itemText}>Public</Text>
                <Text style={styles.categoryText}>Anyone can join, view, and search the posts in this community.</Text>
              </View>
              <RadioButton
                id='public'
                onPress={(value) => setSelectedId(value)}
                value={'public'}
                selected={selectedId === 'public'}
                color={selectedId === 'public' ? '#1054DE' : '#444'}
                size={17}

              />
            </Pressable>

            <Pressable onPress={() => setSelectedId('private')} style={styles.listItem}>

              <View style={styles.avatar}>
                <SvgXml
                  width={24}
                  height={24}
                  xml={privateIcon}
                />
              </View>

              <View style={styles.optionDescription}>
                <Text style={styles.itemText}>Private</Text>
                <Text style={styles.categoryText}>Only members invited by the moderators can join, view, and search the posts in this community.</Text>
              </View>
              <RadioButton
                id='private'
                onPress={(value) => setSelectedId(value)}
                value={'private'}
                selected={selectedId === 'private'}
                color={selectedId === 'private' ? '#1054DE' : '#444'}
                size={17}
              />
            </Pressable>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.inputTitle}>
                Add members<Text style={styles.requiredField}> *</Text>
              </Text>
            </View>
            <Pressable onPress={() => setAddMembersModal(true)} style={styles.categoryContainer}>
              <View style={styles.avatar}>
                <SvgXml style={styles.arrowIcon} xml={plusIcon} width={24} height={24} />
              </View>
            </Pressable>
          </View>
          <Pressable style={styles.createButton}><Text style={styles.createText}>Create community</Text></Pressable>
        </View>

      </View>
      <ChooseCategoryModal onSelect={handleSelectCategory} onClose={() => setCategoryModal(false)} visible={categoryModal} />
      <AddMembersModal onSelect={handleAddMembers} onClose={() => setAddMembersModal(false)} visible={addMembersModal} />
    </ScrollView>
  );
}
