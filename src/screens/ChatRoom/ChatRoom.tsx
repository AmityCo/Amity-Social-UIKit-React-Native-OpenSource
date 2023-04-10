/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  LogBox,
  TouchableOpacity,
  TextInput,
  NativeScrollEvent,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import CustomText from '../../components/CustomText';
import styles from './styles';
import {
  Bubble,
  GiftedChat,
  IMessage,
  MessageImage,
  MessageText,
} from 'react-native-gifted-chat';
import { RouteProp, useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../routes/RouteParamList';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import GroupChat from '../../../assets/icon/GroupChat.svg';
import BackButton from '../../components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import {
  createMessage,
  createQuery,
  liveMessages,
  runQuery,
} from '@amityco/ts-sdk';
import useAuth from '../../hooks/useAuth';
import {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import type { Action } from '../EditChatDetail/EditChatRoomDetail';
import { uploadFile } from '../../providers/file-provider';
import LoadingIndicator from '../../components/LoadingIndicator';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

type ChatRoomScreenComponentType = React.FC<{
  route: RouteProp<RootStackParamList, 'ChatRoom'>;
  navigation: StackNavigationProp<RootStackParamList, 'ChatRoom'>;
}>;
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();
const ChatRoom: ChatRoomScreenComponentType = ({ route }) => {
  const { chatReceiver, groupChat, channelId } = route.params;
  // console.log('groupChat: ', groupChat);
  // console.log('channelId: ', channelId);
  console.log('test env', Constants.appOwnership);
  const { client } = useAuth();
  const [isScrollTop, setIsScrollTop] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messagesData, setMessagesData] =
    useState<Amity.LiveCollection<Amity.Message>>();
  // console.log('messagesData: ', messagesData);
  const [inputText, setInputText] = useState<string>('');
  const {
    data: messagesArr = [],
    onNextPage,
    hasNextPage,
  } = messagesData ?? {};

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  // const [isVoiceMessage, setIsVoiceMessage] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [imageUri, setImageUri] = useState<string | undefined>();
  const imageUriRef = useRef(imageUri);
  const [unSubFunc, setUnSubFunc] = useState<any>();
  const [loadingImages, setLoadingImages] = useState<string[]>([]);

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
      console.log('result: ', result);

      if (
        !result.canceled &&
        result.assets &&
        result.assets.length > 0 &&
        result.assets[0] !== null &&
        result.assets[0]
      ) {
        imageUriRef.current = (result.assets[0] as Record<string, any>).uri;
        setImageUri(result.assets[0].uri);
      }
    } else {
      openImageGallery();
    }
  };
  const pickCamera = async () => {
    // No permissions request is necessary for launching the image library
    if (Constants.appOwnership === 'expo') {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      console.log('permission: ', permission);
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
          setImageUri(result.assets[0].uri);
          // do something with uri
        }
      }
    } else {
      openCamera();
    }
  };

  useEffect(() => {
    if (imageUri) {
      console.log('imageUri: ', imageUri);
      createImageMessage();
      const oldArr: string[] = loadingImages;
      const newArray: string[] = [...oldArr, `${imageUri}`];
      setLoadingImages(newArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUri]);

  function onQueryMessages() {
    const removeLoadingMessage = messages.filter((item) => !item.pending);
    setMessages(removeLoadingMessage);
    setLoadingImages([]);
    const unSubScribe = liveMessages(
      { subChannelId: channelId, limit: 10 },
      setMessagesData
    );
    console.log('channelId: ', channelId);
    console.log('response: ', unSubScribe);
    setUnSubFunc(() => unSubScribe);
  }

  useEffect(() => {
    if (channelId) {
      console.log('channelId:========> ', channelId);
      onQueryMessages();
    }
  }, [channelId]);
  const createImageMessage = async () => {
    const fileId = await uploadFile(imageUriRef.current as string);
    console.log('fileId555: ', fileId);
    if (fileId) {
      const query = createQuery(createMessage, {
        subChannelId: channelId,
        dataType: 'file', // image, file, video, audio
        fileId: fileId,
      });

      runQuery(query, ({ data: message }) => {
        const removeLoadingMessage = messages.filter((item) => !item.pending);
        setLoadingImages([]);
        setMessages(removeLoadingMessage);
        setImageUri('');
        console.log('create message success', message);
      });
    }
  };
  function handleBack() {
    console.log('handleBack: ', handleBack);
    unSubFunc();
  }
  navigation.setOptions({
    // eslint-disable-next-line react/no-unstable-nested-components
    header: () => (
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
                      uri: `https://api.amity.co/api/v3/files/${chatReceiver.avatarFileId}/download`,
                    }
                  : require('../../../assets/icon/Placeholder.png')
              }
            />
          ) : groupChat?.avatarFileId ? (
            <Image
              style={styles.avatar}
              source={{
                uri: `https://api.amity.co/api/v3/files/${groupChat.avatarFileId}/download`,
              }}
            />
          ) : (
            <View style={styles.icon}>
              {/* <GroupChat width={23} height={20} /> */}
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
    ),
    headerTitle: '',
  });

  const renderBubble = (props: any) => {
    // console.log('props: ', props);
    return (
      <View
        style={props.position === 'left' ? styles.chatLeft : styles.chatRight}
      >
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: props.currentMessage.image
                ? 'transparent'
                : '#EBECEF',
              borderRadius: 8,
              borderTopStartRadius: 0,
            },

            right: {
              backgroundColor: props.currentMessage.image
                ? 'transparent'
                : '#1054DE',
              borderRadius: 8,
              borderTopRightRadius: 0,
            },
          }}
          timeTextStyle={{
            left: {
              display: 'none',
            },
            right: {
              display: 'none',
            },
          }}
          renderTicks={renderPendingIcon}
        />

        <CustomText style={styles.chatTime}>
          {!props.currentMessage.pending &&
            moment(props.currentMessage.createdAt).format('hh:mm A')}
        </CustomText>
      </View>
    );
  };
  const renderPendingIcon = (props: any) => {
    const { pending } = props;
    if (pending) {
      return (
        <View style={styles.sendingStatus}>
          <CustomText>Sending</CustomText>
          <LoadingIndicator />
        </View>
      );
    } else {
      return;
    }
  };

  const renderMessageText = (props: any) => {
    return (
      <MessageText
        {...props}
        textStyle={{ left: { color: '#292B32' }, right: { color: '#FFFFFF' } }}
      />
    );
  };

  function renderMessageImage(props: any) {
    const { currentMessage } = props;
    console.log('currentMessage: ', currentMessage.pending);

    return (
      <MessageImage
        {...props}
        source={{ uri: currentMessage.image }}
        imageStyle={{ resizeMode: 'cover' }}
        containerStyle={{ backgroundColor: 'transparent' }}
      />
    );
  }
  function renderMessage(props: any) {
    return (
      <View
        style={{
          flexDirection: props.position === 'left' ? 'row' : 'row-reverse',
          marginVertical: 5,
        }}
      >
        {props.position === 'left' && (
          <Image
            source={
              props.currentMessage.user.avatar
                ? { uri: props.currentMessage.user.avatar }
                : require('../../../assets/icon/Placeholder.png')
            }
            style={styles.avatarImage}
          />
        )}
        <View>
          {props.position === 'left' && (
            <CustomText style={styles.userName}>
              {props.currentMessage.user.name}
            </CustomText>
          )}
          {renderBubble(props)}
        </View>
      </View>
    );
  }

  const onSendMessage = () => {
    Keyboard.dismiss();
    const query = createQuery(createMessage, {
      subChannelId: channelId,
      dataType: 'text',
      data: {
        text: inputText,
      },
    });
    setInputText('');

    runQuery(query, ({ data: message }) => {
      console.log('message created: ', message);
    });
  };

  useEffect(() => {
    if (messagesArr.length > 0) {
      const formattedMessages = messagesArr.map((item) => {
        const targetIndex: number | undefined =
          groupChat &&
          groupChat.users?.findIndex(
            (groupChatItem) => item.creatorId == groupChatItem.userId
          );
        let avatarUrl = '';
        if (groupChat && targetIndex) {
          avatarUrl = `https://api.amity.co/api/v3/files/${
            (groupChat?.users as any)[targetIndex as number].avatarFileId as any
          }/download`;
        } else if (chatReceiver) {
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
          };
        }
      });
      setMessages(formattedMessages);
    }
  }, [messagesArr]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const handlePress = () => {
    dismissKeyboard();
    setIsExpanded(!isExpanded);
  };
  // const handleVoicePress = () => {
  //   dismissKeyboard();
  //   setIsVoiceMessage(!isVoiceMessage);
  // };
  // const [isHolding, setIsHolding] = useState(false);

  // const [voiceFile, setVoiceFile] = useState(0);
  // const handleTouchStart = () => {
  //   setIsHolding(true);
  // };

  // const renderVoiceButton = () => {
  //   return (
  //     <TouchableWithoutFeedback
  //       onPressIn={handleTouchStart}
  //       onPressOut={handleTouchEnd}>
  //       <View style={styles.voiceInput}>
  //         {isHolding ? (
  //           <CustomText style={{fontSize: 16, textAlign: 'center'}}>
  //             Recording...
  //           </CustomText>
  //         ) : (
  //           <View style={styles.voiceRecordContainer}>
  //           <Image
  //               source={require('../../../assets/icon/mic.png')}
  //               style={styles.voiceIcon}
  //             />
  //           <CustomText style={{fontSize: 16, textAlign: 'center'}}>
  //             Hold to record
  //           </CustomText>
  //           </View>
  //         )}
  //       </View>
  //     </TouchableWithoutFeedback>
  //   );
  // };
  const customInput = () => {
    return (
      <ScrollView
        style={styles.scrollView}
        keyboardDismissMode={Platform.OS === 'ios' ? 'none' : 'on-drag'}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* <TouchableOpacity onPress={handleVoicePress}>
              <Image
                source={require('../../../assets/icon/keyboard.png')}
                style={styles.voiceIcon}
              />
            </TouchableOpacity> */}

          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={(value) => setInputText(value)}
            onFocus={() => setIsExpanded(false)}
            placeholder="Type a message..."
            multiline
          />

          {inputText.length > 0 ? (
            <TouchableOpacity onPress={onSendMessage} style={styles.sendIcon}>
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
      </ScrollView>
    );
  };
  const isCloseToTop = (nativeEvent: NativeScrollEvent) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

    return contentSize.height - layoutMeasurement.height <= contentOffset.y;
  };
  useEffect(() => {
    if (hasNextPage && onNextPage) {
      onNextPage();
    }
  }, [isScrollTop]);

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
  useEffect(() => {
    if (loadingImages && loadingImages.length > 0) {
      console.log('loadingImageUri====>: ', loadingImages);

      const loadingMessages = loadingImages.map((item) => {
        return {
          _id: '',
          text: '',
          image: item,
          createdAt: new Date(),
          user: {
            _id: (client as Amity.Client)?.userId ?? '',
          },
          pending: true,
        };
      });
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, loadingMessages)
      );
      //  setMessages(prev =>[...prev,...loadingMessages])
    }
  }, [loadingImages]);
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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {/* <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        // keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 40}
      > */}
      <SafeAreaView
        edges={['top']}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          //  marginBottom: Platform.OS == "ios" ? 160 : 20,
          backgroundColor: 'white',
        }}
      >
        <GiftedChat
          messages={messages}
          listViewProps={{
            scrollEventThrottle: 16,
            onScroll: ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
              if (isCloseToTop(nativeEvent)) {
                console.log('scroll up');
                setIsScrollTop(true);
              }
            },
          }}
          renderMessageText={renderMessageText}
          // onSend={(messages: any) => onSend(messages)}
          user={{
            _id: (client as Amity.Client).userId as string,
          }}
          renderMessage={renderMessage}
          renderMessageImage={renderMessageImage}
          // eslint-disable-next-line react-native/no-inline-styles
          messagesContainerStyle={{
            marginTop: Platform.OS === 'ios' ? -40 : 0,
            marginBottom: 0,
            paddingBottom: 20,
          }}
          renderInputToolbar={() => (
            <View
              style={{
                width: '100%',
                backgroundColor: 'white',
                bottom: Platform.OS == 'android' ? 25 : -20,
              }}
            >
              {customInput()}
            </View>
          )}
        />

        {isExpanded && (
          <View
            style={{ height: 180, flexDirection: 'row', marginVertical: 15 }}
          >
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
              disabled={loadingImages.length > 0}
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
      </SafeAreaView>
      {/* </KeyboardAvoidingView> */}
      {/* </SafeAreaView> */}
    </TouchableWithoutFeedback>
  );
};
export default ChatRoom;
