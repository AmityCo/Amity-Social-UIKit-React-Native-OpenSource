import React, { ReactElement, useCallback, useRef } from 'react';

import { View, FlatList, TouchableOpacity, Image } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
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
  console.log('channelObjects: ', channelObjects.length);
  const flatListRef = useRef(null);
  // const [channelOptions, setChannelOptions] = useState<Amity.RunQueryOptions<typeof queryChannels>>();
  // const {loading, nextPage, error} = channelOptions ?? {};

  const [channelData, setChannelData] =
    useState<Amity.LiveCollection<Amity.Channel>>();
  console.log('channelData length: ', channelData?.data);
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
      <SafeAreaView style={styles.topBar} edges={['top']}>
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

  useEffect(() => {
    if (isConnected) {
      // console.log('client test: ', client.userId);
      onQueryChannel();
    }
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const onQueryChannel = () => {
    console.log('=======pass liveChannel========');
    liveChannels(
      { limit: 10, membership: 'member', sortBy: 'lastActivity' },
      (value) => {
        // // console.log('value: ', value);
        setChannelData(value);

        // if (value?.data.length > channelObjects.length) {
        //   setChannelData(value);
        // }
      }
    );
  };

  useEffect(() => {
    if (channels.length > 0) {
      const formattedChannelObjects: IChatListProps[] = channels.map(
        (item: Amity.Channel<any>) => {
          const lastActivityDate: string = moment(item.lastActivity).format(
            'DD/MM/YYYY'
          );
          const todayDate = moment(Date.now()).format('DD/MM/YYYY');
          let dateDisplay;
          if (lastActivityDate == todayDate) {
            dateDisplay = moment(item.lastActivity).format('hh:mm A');
          } else {
            dateDisplay = moment(item.lastActivity).format('DD/MM/YYYY');
          }

          return {
            chatId: item.channelId ?? '',
            chatName: item.displayName ?? '',
            chatMemberNumber: item.memberCount ?? 0,
            unReadMessage: item.defaultSubChannelUnreadCount ?? 0, // change to defaultSubChannelUnreadCount later after product team fix this !!!!!!!!!
            messageDate: dateDisplay ?? '',
            channelType: item.type ?? '',
            avatarFileId: item.avatarFileId,
          };
        }
      );
      setChannelObjects([...formattedChannelObjects]);
      setLoadChannel(false);
      //   if (
      //     channelObjects.length > 0 &&
      //     channels.length > channelObjects.length
      //   ) {
      //     const nextChannels = formattedChannelObjects.slice(
      //       channelObjects.length,
      //       formattedChannelObjects.length
      //     );

      //     console.log('nextChannels:pass========> ', nextChannels.length);
      //     setChannelObjects([...channelObjects, ...nextChannels]);
      //     setLoadChannel(false);
      //   }
      //   else if (channelObjects.length === 0) {
      //     console.log('pass once');
      //     setChannelObjects([...formattedChannelObjects]);
      //     setLoadChannel(false);
      //   }
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
    console.log('item==>: ', item);
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
      <View style={styles.tabView}>
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
