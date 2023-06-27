import { NavigationContainer } from '@react-navigation/native';

import * as React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from './RouteParamList';
import useAuth from '../hooks/useAuth';
import Explore from '../screens/social/Explore';
import CategoryList from '../screens/social/CategorytList';
import CommunityList from '../screens/social/CommunityList';
import CommunityHome from '../screens/social/CommunityHome/index';
import { CommunitySetting } from '../screens/social/CommunitySetting/index';
import CommunityMemberDetail from '../screens/social/CommunityMemberDetail/CommunityMemberDetail';
import Home from '../screens/social/Home';
import UserProfile from '../screens/social/UserProfile/UserProfile';
import { EditProfile } from '../screens/social/EditProfile/EditProfile';
import UserProfileSetting from '../screens/social/UserProfileSetting/UserProfileSetting';

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
          <Stack.Screen name="UserProfile" component={UserProfile} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen
            name="UserProfileSetting"
            component={UserProfileSetting}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
