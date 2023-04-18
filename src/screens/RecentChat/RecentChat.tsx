import React, { ReactElement, useCallback, useRef } from 'react';

import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';

import { liveChannels } from '@amityco/ts-sdk';
import ChatList, { IChatListProps } from '../../components/ChatList/index';
import useAuth from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import moment from 'moment';

import styles from './styles';
import CustomText from '../../components/CustomText';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import LoadingIndicator from '../../components/LoadingIndicator/index';
export default function RecentChat() {
  const { isConnected } = useAuth();

  const [channelObjects, setChannelObjects] = useState<IChatListProps[]>([]);
  const [loadChannel, setLoadChannel] = useState<boolean>(true);
  // const [unSubFunc, setUnSubFunc] = useState<any>();

  const flatListRef = useRef(null);

  const [channelData, setChannelData] =
    useState<Amity.LiveCollection<Amity.Channel>>();

  const {
    data: channels = [],
    onNextPage,
    hasNextPage,
    // loading,
    // error,
  } = channelData ?? {};
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  navigation.setOptions({
    // eslint-disable-next-line react/no-unstable-nested-components
    header: () => (
      <SafeAreaView style={styles.topBar}>
        <CustomText style={styles.titleText}>Chat</CustomText>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SelectMembers');
          }}
        >
          <Image
            style={styles.addChatIcon}
            source={require('../../../assets/icon/addChat.png')}
          />
        </TouchableOpacity>
      </SafeAreaView>
    ),
    headerTitle: '',
  });

  const onQueryChannel = () => {
    liveChannels(
      { limit: 10, membership: 'member', sortBy: 'lastActivity' },
      (value) => {
        setChannelData(value);
      }
    );
    // setUnSubFunc(() => unSubScribe);
  };
  useEffect(() => {
    if (isConnected) {
      onQueryChannel();
    }
  }, [isConnected]);
  useEffect(() => {
    if (channels.length > 0) {
      const formattedChannelObjects: IChatListProps[] = channels.map(
        (item: Amity.Channel<any>) => {
          const lastActivityDate: string = moment(item.lastActivity).format(
            'DD/MM/YYYY'
          );
          const todayDate = moment(Date.now()).format('DD/MM/YYYY');
          let dateDisplay;
          if (lastActivityDate === todayDate) {
            dateDisplay = moment(item.lastActivity).format('hh:mm A');
          } else {
            dateDisplay = moment(item.lastActivity).format('DD/MM/YYYY');
          }

          return {
            chatId: item.channelId ?? '',
            chatName: item.displayName ?? '',
            chatMemberNumber: item.memberCount ?? 0,
            unReadMessage: item.unreadCount ?? 0,
            messageDate: dateDisplay ?? '',
            channelType: item.type ?? '',
            avatarFileId: item.avatarFileId,
          };
        }
      );
      setChannelObjects([...formattedChannelObjects]);
      setLoadChannel(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleLoadMore = () => {
    if (hasNextPage && onNextPage) {
      onNextPage();
    }
  };

  const renderRecentChat = useCallback((): ReactElement => {
    return loadChannel ? (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{ marginTop: 20 }}>
        <LoadingIndicator />
      </View>
    ) : (
      <FlatList
        data={channelObjects}
        renderItem={({ item }) => renderChatList(item)}
        keyExtractor={(item) => item.chatId.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ref={flatListRef}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{ flexGrow: 1 }}
      />
    );
  }, [loadChannel, channelObjects, handleLoadMore]);
  const renderChatList = (item: IChatListProps): ReactElement => {
    return (
      <ChatList
        key={item.chatId}
        chatId={item.chatId}
        chatName={item.chatName}
        chatMemberNumber={item.chatMemberNumber}
        unReadMessage={item.unReadMessage}
        messageDate={item.messageDate}
        channelType={item.channelType}
        avatarFileId={item.avatarFileId}
      />
    );
  };
  const renderTabView = (): ReactElement => {
    return (
      <View style={[styles.tabView]}>
        <View style={styles.indicator}>
          <CustomText style={styles.tabViewTitle}>Recent</CustomText>
        </View>
      </View>
    );
  };

  return (
    <View>
      {renderTabView()}
      {renderRecentChat()}
    </View>
  );
}
