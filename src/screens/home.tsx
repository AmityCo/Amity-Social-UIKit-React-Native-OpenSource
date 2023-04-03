import * as React from 'react';
import { useState } from 'react';
// import { useTranslation } from 'react-i18next';

import { View, Button, TextInput } from 'react-native';
import { SessionState } from '../enum/sessionState';
import useAuth from '../hooks/useAuth';

export default function Home({ navigation }: any) {
  // const { t, i18n } = useTranslation();
  const { client, isConnecting } = useAuth();
  console.log('client: ', client);

  const clickLogin = () => {
    // console.log('pass');
    // console.log('client: ', client.useId);
    // login({ userId: inputText || 'top', displayName: inputText || 'top' });
  };
  const clickChatDetail = () => {
    navigation.navigate('ChatDetail');
  };
  const checkLogin = () => {
    console.log('pass22');
    console.log('client: ', isConnecting);
    console.log('client: ', client);

    if (
      (client as Amity.Client).sessionState ===
      (SessionState.established as string)
    ) {
      navigation.navigate('SelectMembers');
    }
  };
  const checkLogin2 = () => {
    console.log('pass2');
    console.log('isConnecting: ', isConnecting);
    console.log('client: ', client);

    if (
      (client as Amity.Client).sessionState ===
      (SessionState.established as string)
    ) {
      navigation.navigate('RecentChat');
    }
  };
  const chatRoom = () => {
    console.log('pass2');
    // console.log('client: ', typeof client.sessionState);
    console.log('client: ', client);

    if (
      (client as Amity.Client).sessionState ===
      (SessionState.established as string)
    ) {
      navigation.navigate('ChatRoom2', {
        channelId: '6421a2f271dfbc6449a99886',
      });
    }
  };
  const [inputText, setInputText] = useState<string>('');
  return (
    <View>
      {/* <Text>{t('first')}</Text>
      <Text>{t('second')}</Text>
      <Text>
{t('second')}</Text>
      <Text>{t('second')}</Text> */}
      <Button title="Login" onPress={clickLogin} />
      <Button title="Recent Chat" onPress={checkLogin2} />

      <Button title="Check isConnect" onPress={checkLogin} />
      <TextInput
        value={inputText}
        onChangeText={(value) => setInputText(value)}
        placeholder="Type userId"
        multiline
      />
      <Button title="Chat Detail" onPress={clickChatDetail} />
      <Button title="Chat Room test" onPress={chatRoom} />
      {/* <ChatList/> */}
    </View>
  );
}
