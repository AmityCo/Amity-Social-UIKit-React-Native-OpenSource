import { NavigationContainer } from '@react-navigation/native';

import * as React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from './RouteParamList';
import useAuth from '../hooks/useAuth';
import Explore from '../screens/Social/Explore';
import CategoryList from '../screens/Social/CategorytList';
import CommunityList from '../screens/Social/CommunityList';
import CommunityHome from '../screens/Social/CommunityHome/index';
import { CommunitySetting } from '../screens/Social/CommunitySetting/index';
import CommunityMemberDetail from '../screens/Social/CommunityMemberDetail/CommunityMemberDetail';
import Home from '../screens/Social/Home';
import PostDetail from '../screens/Social/PostDetail';

export default function SocialNavigator() {
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
          <Stack.Screen name="Home" component={Home} />
          {/* <Stack.Screen name="Community" component={Home} /> */}
          <Stack.Screen name="Explore" component={Explore} />
          <Stack.Screen name="PostDetail" component={PostDetail} />
          <Stack.Screen
            name="CategoryList"
            component={CategoryList}
            options={({}) => ({
              title: 'Category',
            })}
          />
          <Stack.Screen name="CommunityHome" component={CommunityHome} />
          <Stack.Screen
            name="CommunityMemberDetail"
            component={CommunityMemberDetail}
          />
          <Stack.Screen name="CommunitySetting" component={CommunitySetting} />
          <Stack.Screen name="CommunityList" component={CommunityList} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
