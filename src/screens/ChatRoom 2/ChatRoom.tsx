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
  Platform,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import CustomText from '../../components/CustomText';
import styles from './styles';
import { RouteProp, useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../routes/RouteParamList';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import GroupChat from '../../../assets/icon/GroupChat.svg';
import BackButton from '../../components/BackButton';

import moment from 'moment';
import { liveMessages } from '@amityco/ts-sdk';
import useAuth from '../../hooks/useAuth';

type ChatRoomScreenComponentType = React.FC<{
  route: RouteProp<RootStackParamList, 'ChatRoom'>;
  navigation: StackNavigationProp<RootStackParamList, 'ChatRoom'>;
}>;
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();

interface IMessage {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  image?: string;
}

const ChatRoom2: ChatRoomScreenComponentType = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { chatReceiver, groupChat, channelId } = route.params;
  // console.log('groupChat: ', groupChat);
  // console.log('channelId: ', channelId);
  const { client } = useAuth();
  // console.log('client: ', client.userId);
  // const [isScrollTop, setIsScrollTop] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  console.log('messages: ', messages);
  const [messagesData, setMessagesData] =
    useState<Amity.LiveCollection<Amity.Message>>();
  // console.log('messagesData: ', messagesData);
  // const [inputText, setInputText] = useState<string>('');
  const { data: messagesArr = [] } = messagesData ?? {};

  const [inputMessage, setInputMessage] = useState('');
  // const [loadingImages, setLoadingImages] = useState<string[]>([]);
  const [unSubFunc, setUnSubFunc] = useState<any>();
  const scrollViewRef = useRef(null);

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
  function onQueryMessages() {
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
  const handleSend = () => {
    if (inputMessage.trim() === '') {
      return;
    }

    // const newMessage = {
    //   _id: ,
    //   text: inputMessage.trim(),
    //   user: {
    //     _id: (client as Amity.Client).userId,
    //     name: 'top',
    //     avatar: '',
    //   },
    //   createdAt: new Date().toLocaleString(),
    // };
    // console.log('newMessage: ', newMessage);
    // setMessages([...messages, newMessage]);
    // setInputMessage('');
  };

  function handleBack() {
    console.log('handleBack: ', handleBack);
    unSubFunc();
  }
  const scrollToBottom = () => {
    if (scrollViewRef && scrollViewRef.current) {
      (scrollViewRef.current as Record<string, any>).scrollToEnd({
        animated: true,
      });
    }
  };

  const sortedMessages = messages.sort((x, y) => {
    return new Date(x.createdAt) > new Date(y.createdAt) ? 1 : -1;
  });
  console.log('sortedMessages: ', sortedMessages);
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.chatContainer}
        ref={scrollViewRef}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      >
        {sortedMessages.map((message) => (
          <View
            key={message._id}
            style={[
              styles.chatBubble,
              message?.user?._id === (client as Amity.Client).userId
                ? styles.userBubble
                : styles.friendBubble,
            ]}
          >
            <Text style={styles.chatText}>{message.text}</Text>
            <Text style={styles.chatTimestamp}>
              {moment(message.createdAt).format('hh:mm A')}
            </Text>
          </View>
        ))}
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 60, android: 100 })}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputMessage}
            onChangeText={(text) => setInputMessage(text)}
            placeholder="Type a message..."
            placeholderTextColor="#8A8A8A"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
export default ChatRoom2;
