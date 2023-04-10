/* eslint-disable react/no-unstable-nested-components */
import { NavigationContainer } from '@react-navigation/native';

import RecentChat from '../screens/RecentChat/RecentChat';

import * as React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SelectMembers from '../screens/SelectMembers/SelectMembers';

import ChatRoom from '../screens/ChatRoom/ChatRoom';
import type { RootStackParamList } from './RouteParamList';
import { Text, TouchableOpacity } from 'react-native';
import { ChatRoomSetting } from '../screens/ChatDetail/ChatRoomSetting';
import { EditChatRoomDetail } from '../screens/EditChatDetail/EditChatRoomDetail';
import MemberDetail from '../screens/MemberDetail/MemberDetail';
import useAuth from '../hooks/useAuth';
// import ChatRoom2 from '../screens/ChatRoom 2/ChatRoom';

export default function AppNavigator() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const { isConnected } = useAuth();
  return (
    <NavigationContainer independent={true}>
      {isConnected && (
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: 'white',
            },
            // headerShown: false,
          }}
        >
          {/* <Stack.Screen
          name="Home"
          component={Home}
          options={({ navigation }) => ({
            title: 'My Screen',
            headerLeft: () => <Text>Chat</Text>,
            // eslint-disable-next-line react/no-unstable-nested-components
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SelectMembers');
                }}
              >
                <Text>Create</Text>
              </TouchableOpacity>
            ),
          })}
        /> */}

          <Stack.Screen
            name="RecentChat"
            component={RecentChat}
            options={({ navigation }) => ({
              title: 'Chat',
              headerLeft: () => <Text>Chat</Text>,
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SelectMembers');
                  }}
                >
                  <Text>Create</Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="ChatRoom"
            //  options={{ headerShown: false }}
            component={ChatRoom}
          />
          {/* <Stack.Screen
            name="ChatRoom2"
            //  options={{ headerShown: false }}
            component={ChatRoom2}
          /> */}
          <Stack.Screen
            name="ChatDetail"
            component={ChatRoomSetting}
            options={{
              title: 'Chat Detail',
            }}
          />
          <Stack.Screen
            name="MemberDetail"
            component={MemberDetail}
            options={{
              title: 'Member Detail',
            }}
          />
          <Stack.Screen
            name="EditChatDetail"
            component={EditChatRoomDetail}
            options={{
              title: 'Edit Chat Detail',
            }}
          />

          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen
              name="SelectMembers"
              component={SelectMembers}
              options={({}) => ({
                title: 'Select member',
              })}
            />
          </Stack.Group>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
