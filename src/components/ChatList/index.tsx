/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
import * as React from 'react';

import { View, TouchableHighlight, Image } from 'react-native';

import { createQuery, runQuery, queryChannelMembers } from '@amityco/ts-sdk';
import CustomText from '../CustomText';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuth from '../../hooks/useAuth';
import { useEffect, useState } from 'react';

export interface IChatListProps {
  chatId: string;
  chatName: string;
  chatMemberNumber: number;
  unReadMessage: number;
  messageDate: string;
  channelType: 'conversation' | 'broadcast' | 'live' | 'community' | '';
  avatarFileId: string | undefined;
}
export interface IUserObject {
  userId: string;
  displayName: string;
  avatarFileId: string;
}
export interface IGroupChatObject {
  displayName: string;
  memberCount: number;
  users: IUserObject[];
  avatarFileId: string | undefined;
}
const ChatList: React.FC<IChatListProps> = ({
  chatId,
  chatName,
  chatMemberNumber,
  unReadMessage,
  messageDate,
  channelType,
  avatarFileId,
}: IChatListProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { client } = useAuth();
  const [oneOnOneChatObject, setOneOnOneChatObject] =
    useState<Amity.Membership<'channel'>[]>();
  const [groupChatObject, setGroupChatObject] =
    useState<Amity.Membership<'channel'>[]>();

  const handlePress = (
    channelId: string,
    channelType: string,
    chatMemberNumber: number
  ) => {
    console.log('type:' + channelType);
    const query = createQuery(queryChannelMembers, {
      channelId: channelId,
    });

    runQuery(query, ({ data: members }) => {
      if (chatMemberNumber === 2 && members) {
        setOneOnOneChatObject(members);
      } else if (members) {
        setGroupChatObject(members);
      }
    });
  };

  useEffect(() => {
    if (oneOnOneChatObject) {
      const targetIndex: number = oneOnOneChatObject?.findIndex(
        (item) => item.userId !== (client as Amity.Client).userId
      );
      const chatReceiver: IUserObject = {
        userId: oneOnOneChatObject[targetIndex]?.userId as string,
        displayName: oneOnOneChatObject[targetIndex]?.user
          ?.displayName as string,
        avatarFileId: oneOnOneChatObject[targetIndex]?.user?.avatarFileId ?? '',
      };
      console.log('chatReceiver: ', chatReceiver);

      navigation.navigate('ChatRoom', {
        channelId: chatId,
        chatReceiver: chatReceiver,
      });
      console.log('chatId: ', chatId);
    }
  }, [oneOnOneChatObject]);

  useEffect(() => {
    if (groupChatObject) {
      const userArr: IUserObject[] = groupChatObject?.map((item) => {
        return {
          userId: item.userId as string,
          displayName: item.user?.displayName as string,
          avatarFileId: item.user?.avatarFileId as string,
        };
      });

      const groupChat: IGroupChatObject = {
        users: userArr,
        displayName: chatName as string,
        avatarFileId: avatarFileId,
        memberCount: chatMemberNumber,
      };
      console.log('group====>: ', groupChat);
      navigation.navigate('ChatRoom', {
        channelId: chatId,
        groupChat: groupChat,
      });
    }
  }, [groupChatObject]);

  return (
    // <View>
    //   <Text>{chatName}</Text>
    // </View>
    <TouchableHighlight
      onPress={() => handlePress(chatId, channelType, chatMemberNumber)}
    >
      <View style={styles.chatCard}>
        <View style={styles.avatarSection}>
          <View style={styles.icon}>
            <Image
              style={styles.avatar}
              source={require('../../../assets/icon/Placeholder.png')}
            />
          </View>
        </View>

        <View style={styles.chatDetailSection}>
          <View style={styles.chatNameWrap}>
            <CustomText style={styles.chatName} numberOfLines={1}>
              {chatName}
            </CustomText>
            <CustomText style={styles.chatLightText}>
              ({chatMemberNumber})
            </CustomText>
          </View>
          <View style={styles.chatTimeWrap}>
            <CustomText style={styles.chatLightText}>{messageDate}</CustomText>
            {unReadMessage > 0 && (
              <View style={styles.unReadBadge}>
                <CustomText style={styles.unReadText}>
                  {unReadMessage}
                </CustomText>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};
export default ChatList;
