/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  LogBox,
  TouchableOpacity,
  TextInput,
  Platform,
  Text,
  KeyboardAvoidingView,
  FlatList,
  Keyboard,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import CustomText from '../../components/CustomText';
import styles from './styles';
import { RouteProp, useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../routes/RouteParamList';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackButton from '../../components/BackButton';

import moment from 'moment';
import {
  createMessage,
  createQuery,
  getFile,
  getSubChannel,
  getSubChannelTopic,
  liveMessages,
  runQuery,
  subscribeTopic,
} from '@amityco/ts-sdk';
import useAuth from '../../hooks/useAuth';
import {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Action } from '../EditChatDetail/EditChatRoomDetail';
import { uploadFile } from '../../providers/file-provider';
import LoadingIndicator from '../../components/LoadingIndicator';
type ChatRoomScreenComponentType = React.FC<{
  route: RouteProp<RootStackParamList, 'ChatRoom'>;
  navigation: StackNavigationProp<RootStackParamList, 'ChatRoom'>;
}>;
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();

interface IMessage {
  _id: string;
  text?: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  image?: string;
  messageType: string;
  isPending?: boolean;
}

const ChatRoom: ChatRoomScreenComponentType = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { chatReceiver, groupChat, channelId } = route.params;
  const { client } = useAuth();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messagesData, setMessagesData] =
    useState<Amity.LiveCollection<Amity.Message>>();
  // const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  const {
    data: messagesArr = [],
    onNextPage,
    hasNextPage,
  } = messagesData ?? {};

  const [inputMessage, setInputMessage] = useState('');
  // const [loadingImages, setLoadingImages] = useState<string[]>([]);
  const [unSubFunc, setUnSubFunc] = useState<any>();
  const [sortedMessages, setSortedMessages] = useState<IMessage[]>([]);
  // console.log('sortedMessages: ', sortedMessages);
  const flatListRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [visibleFullImage, setIsVisibleFullImage] = useState<boolean>(false);
  const [fullImage, setFullImage] = useState<string>('');
  const imageUriRef = useRef(imageUri);
  const [loadingImages, setLoadingImages] = useState<IMessage[]>([]);
  console.log('loadingImages: ', loadingImages);
  const [subChannelData, setSubChannelData] = useState<Amity.SubChannel>();
  // console.log('loadingImages: ', loadingImages);
  const disposers: Amity.Unsubscriber[] = [];
  console.log('disposers: ', disposers);

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
  navigation.setOptions({
    // eslint-disable-next-line react/no-unstable-nested-components
    header: () => (
      <SafeAreaView edges={['top']}>
        <View style={styles.topBar}>
          <View style={styles.chatTitleWrap}>
            <TouchableOpacity onPress={handleBack}>
              <BackButton onPress={handleBack} />
            </TouchableOpacity>

            {chatReceiver ? (
              <Image
                style={styles.avatar}
                source={
                  chatReceiver?.avatarFileId
                    ? {
                        uri: `https://api.amity.co/api/v3/files/${chatReceiver?.avatarFileId}/download`,
                      }
                    : require('../../../assets/icon/Placeholder.png')
                }
              />
            ) : groupChat?.avatarFileId ? (
              <Image
                style={styles.avatar}
                source={{
                  uri: `https://api.amity.co/api/v3/files/${groupChat?.avatarFileId}/download`,
                }}
              />
            ) : (
              <View style={styles.icon}>
                <Image
                  style={styles.chatIcon}
                  source={require('../../../assets/icon/GroupChat.png')}
                />
              </View>
            )}
            <View>
              <CustomText style={styles.chatName} numberOfLines={1}>
                {chatReceiver
                  ? chatReceiver?.displayName
                  : groupChat?.displayName}
              </CustomText>
              {groupChat && (
                <CustomText style={styles.chatMember}>
                  {groupChat?.memberCount} members
                </CustomText>
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChatDetail', { channelId: channelId });
            }}
          >
            <Image
              style={styles.settingIcon}
              source={require('../../../assets/icon/setting.png')}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    ),
    headerTitle: '',
  });

  // function onQueryMessages() {
  //   const unSubScribe = liveMessages(
  //     { subChannelId: channelId, limit: 8 },
  //     setMessagesData
  //   );
  //   console.log('channelId: ', channelId);
  //   console.log('response: ', unSubScribe);
  //   setUnSubFunc(() => unSubScribe);
  // }
  const subscribeSubChannel = (subChannel: Amity.SubChannel) =>
    disposers.push(subscribeTopic(getSubChannelTopic(subChannel)));
  useEffect(() => {
    if (channelId) {
      const query = createQuery(getSubChannel, channelId);

      runQuery(query, ({ data: subChannel }) => setSubChannelData(subChannel));
    }
  }, [channelId]);

  useEffect(() => {
    if (subChannelData && channelId) {
      console.log('subChannelData before pass: ', subChannelData);
      const response = liveMessages(
        { subChannelId: channelId, limit: 10 },
        (value) => {
          console.log('value: ', value);
          setMessagesData(value);
          subscribeSubChannel(subChannelData as Amity.SubChannel);
        }
      );
      disposers.push(() => response);
      // console.log('response: ', response);
      setUnSubFunc(() => response);
    }
  }, [subChannelData]);
  useEffect(() => {
    if (messagesArr.length > 0) {
      const formattedMessages = messagesArr.map((item) => {
        const targetIndex: number | undefined =
          groupChat &&
          groupChat.users?.findIndex(
            (groupChatItem) => item.creatorId === groupChatItem.userId
          );
        let avatarUrl = '';
        if (
          groupChat &&
          targetIndex &&
          (groupChat?.users as any)[targetIndex as number]?.avatarFileId
        ) {
          avatarUrl = `https://api.amity.co/api/v3/files/${
            (groupChat?.users as any)[targetIndex as number]
              ?.avatarFileId as any
          }/download`;
        } else if (chatReceiver && chatReceiver.avatarFileId) {
          avatarUrl = `https://api.amity.co/api/v3/files/${chatReceiver.avatarFileId}/download`;
        }

        if ((item?.data as Record<string, any>)?.fileId) {
          return {
            _id: item.messageId,
            text: '',
            image:
              `https://api.amity.co/api/v3/files/${
                (item?.data as Record<string, any>).fileId
              }/download` ?? undefined,
            createdAt: new Date(item.createdAt),
            user: {
              _id: item.creatorId ?? '',
              name: item.creatorId ?? '',
              avatar: avatarUrl,
            },
            messageType: item.dataType,
          };
        } else {
          return {
            _id: item.messageId,
            text:
              ((item?.data as Record<string, string>)?.text as string) ?? '',
            createdAt: new Date(item.createdAt),
            user: {
              _id: item.creatorId ?? '',
              name: item.creatorId ?? '',
              avatar: avatarUrl,
            },
            messageType: item.dataType,
          };
        }
      });
      setMessages(formattedMessages);
    }
  }, [messagesArr]);
  const handleSend = () => {
    if (inputMessage.trim() === '') {
      return;
    }
    Keyboard.dismiss();
    const query = createQuery(createMessage, {
      subChannelId: channelId,
      dataType: 'text',
      data: {
        text: inputMessage,
      },
    });
    setInputMessage('');
    scrollToBottom();
    runQuery(query, ({ data: message }) => {
      console.log('message created: ', message);
    });
  };

  function handleBack(): void {
    console.log('handleBack: ', handleBack);
    console.log('disposers: ', disposers);
    disposers.forEach((fn) => fn());
    unSubFunc();
  }

  const loadNextMessages = () => {
    if (flatListRef.current && hasNextPage && onNextPage) {
      onNextPage();
      (flatListRef.current as Record<string, any>).scrollToOffset({
        offset: 0,
        animated: false,
      });
    }
  };

  useEffect(() => {
    // console.log('messages: ', messages);
    const sortedMessagesData: IMessage[] = messages.sort((x, y) => {
      return new Date(x.createdAt) < new Date(y.createdAt) ? 1 : -1;
    });
    // console.log('sortedMessagesData: ', sortedMessagesData);
    const reOrderArr = sortedMessagesData;
    setSortedMessages([...reOrderArr]);
  }, [messages]);
  const openFullImage = (image: string) => {
    const fullSizeImage: string = image + '?size=full';
    setFullImage(fullSizeImage);
    setIsVisibleFullImage(true);
  };
  const renderChatMessages = (message: IMessage) => {
    // console.log('message: ', message);
    const isUserChat: boolean =
      message?.user?._id === (client as Amity.Client).userId;

    return (
      <View
        style={!isUserChat ? styles.leftMessageWrap : styles.rightMessageWrap}
      >
        {!isUserChat && (
          <Image
            source={
              message.user.avatar
                ? { uri: message.user.avatar }
                : require('../../../assets/icon/Placeholder.png')
            }
            style={styles.avatarImage}
          />
        )}

        <View>
          {!isUserChat && (
            <Text
              style={isUserChat ? styles.chatUserText : styles.chatFriendText}
            >
              {message.user.name}
            </Text>
          )}

          {message.messageType === 'text' ? (
            <View
              key={message._id}
              style={[
                styles.textChatBubble,
                isUserChat ? styles.userBubble : styles.friendBubble,
              ]}
            >
              <Text
                style={isUserChat ? styles.chatUserText : styles.chatFriendText}
              >
                {message.text}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.imageChatBubble,
                isUserChat ? styles.userImageBubble : styles.friendBubble,
              ]}
              onPress={() => openFullImage(message.image as string)}
            >
              <Image
                style={styles.imageMessage}
                source={{
                  uri: message.image,
                }}
              />
            </TouchableOpacity>
          )}

          <Text
            style={[
              styles.chatTimestamp,
              {
                alignSelf: isUserChat ? 'flex-end' : 'flex-start',
              },
            ]}
          >
            {message.isPending ? (
              <View style={styles.loadingRow}>
                <Text style={styles.loadingText}>sending</Text>
                <LoadingIndicator />
              </View>
            ) : (
              moment(message.createdAt).format('hh:mm A')
            )}
          </Text>
        </View>
      </View>
    );
  };
  const handlePress = () => {
    Keyboard.dismiss();
    setIsExpanded(!isExpanded);
  };
  const scrollToBottom = () => {
    if (flatListRef && flatListRef.current) {
      (flatListRef.current as Record<string, any>).scrollToOffset({
        animated: true,
        offset: 0,
      });
    }
  };
  const handleOnFocus = () => {
    setIsExpanded(false);
  };
  const createImageMessage = async () => {
    const fileId = await uploadFile(imageUriRef.current as string);
    console.log('fileId555: ', fileId);
    if (fileId) {
      const query = createQuery(createMessage, {
        subChannelId: channelId,
        dataType: 'file', // image, file, video, audio
        fileId: fileId,
      });

      runQuery(createQuery(getFile, fileId), (result) => {
        const stopLoadingMessages = messages.filter(
          (item) => item._id !== result.data.attributes.name
        );
        setMessages(stopLoadingMessages);
      });
      runQuery(query, ({ data: message }) => {
        // const removeLoadingMessage = messages.filter((item) => !item.pending);
        // setLoadingImages([]);
        // setMessages(removeLoadingMessage);
        setImageUri('');
        console.log('create message success', message);
      });
    }
  };
  function loadingImagesConfig(imageUrl: string) {
    console.log('loadingImagesConfig: ', loadingImagesConfig);
    const oldArr: IMessage[] = loadingImages;
    const fileName = imageUrl.split('/').pop();
    const newImageMessage: IMessage = {
      _id: fileName as string,
      user: {
        _id: (client as Amity.Client).userId as string,
        name: (client as Amity.Client).userId as string,
        avatar: '',
      },
      isPending: true,
      messageType: 'image',
      image: imageUrl,
      createdAt: new Date(Date.now()),
    };
    const found = oldArr.some((item) => item.image === newImageMessage.image);
    if (!found) {
      oldArr.push(newImageMessage);
    }
    setLoadingImages(oldArr);
    handleRefresh();
  }
  // useEffect(() => {

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [imageUri]);
  useEffect(() => {
    const loadingMessages: IMessage[] = loadingImages.concat(messages);
    console.log('====render====');
    setMessages(loadingMessages);
    if (imageUri) {
      // console.log('imageUri: ', imageUri);
      createImageMessage();
    }
  }, [imageUri]);

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
            loadingImagesConfig(
              (response.assets[0] as Record<string, any>).uri
            );
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
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
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
          loadingImagesConfig(result.assets[0].uri);
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
            loadingImagesConfig(
              (response.assets[0] as Record<string, any>).uri
            );
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
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result);

      if (
        !result.canceled &&
        result.assets &&
        result.assets.length > 0 &&
        result.assets[0] !== null &&
        result.assets[0]
      ) {
        imageUriRef.current = (result.assets[0] as Record<string, any>).uri;
        setImageUri(result.assets[0].uri);
        loadingImagesConfig(result.assets[0].uri);
      }
    } else {
      openImageGallery();
    }
  };

  // const allMessages = [...loadingImages, ...sortedMessages];
  // console.log('allMessages: ', allMessages);
  const handleRefresh = () => {
    // Perform some logic to refresh the data
    const loadingMessages: IMessage[] = loadingImages.concat(messages);
    console.log('loadingMessages: ', loadingMessages);
    console.log('====render====');
    setMessages(loadingMessages);
    setLoadingImages([]);
  };
  return (
    <View style={styles.container}>
      {/* {isMessagesLoading && <LoadingIndicator />} */}
      <View style={styles.chatContainer}>
        <FlatList
          data={sortedMessages}
          renderItem={({ item }) => renderChatMessages(item)}
          keyExtractor={(item) => item._id}
          onEndReached={loadNextMessages}
          onEndReachedThreshold={0.5}
          inverted
          ref={flatListRef}
          refreshing={false}
          onRefresh={handleRefresh}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 110, android: 100 })}
        style={styles.AllInputWrap}
      >
        <View style={styles.InputWrap}>
          <TextInput
            style={styles.input}
            value={inputMessage}
            onChangeText={(text) => setInputMessage(text)}
            placeholder="Type a message..."
            placeholderTextColor="#8A8A8A"
            onFocus={handleOnFocus}
          />

          {inputMessage.length > 0 ? (
            <TouchableOpacity onPress={handleSend} style={styles.sendIcon}>
              <Image
                source={require('../../../assets/icon/send.png')}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handlePress} style={styles.sendIcon}>
              <Image
                source={require('../../../assets/icon/plus.png')}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          )}
        </View>
        {isExpanded && (
          <View style={styles.expandedArea}>
            <TouchableOpacity
              onPress={pickCamera}
              style={{ marginHorizontal: 30 }}
            >
              <View style={styles.IconCircle}>
                <Image
                  source={require('../../../assets/icon/camera.png')}
                  style={{ width: 32, height: 28 }}
                />
              </View>
              <CustomText>Camera</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              // disabled={loadingImages.length > 0}
              onPress={pickImage}
              style={{ marginHorizontal: 20, alignItems: 'center' }}
            >
              <View style={styles.IconCircle}>
                <Image
                  source={require('../../../assets/icon/gallery.png')}
                  style={{ width: 32, height: 28 }}
                />
              </View>
              <CustomText>Album</CustomText>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
      <ImageView
        images={[{ uri: fullImage }]}
        imageIndex={0}
        visible={visibleFullImage}
        onRequestClose={() => setIsVisibleFullImage(false)}
      />
    </View>
  );
};
export default ChatRoom;
