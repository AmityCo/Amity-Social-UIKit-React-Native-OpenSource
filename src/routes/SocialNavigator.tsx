import { NavigationContainer } from '@react-navigation/native';

import * as React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from './RouteParamList';
import useAuth from '../hooks/useAuth';
import Explore from '../screens/Explore';
import CategoryList from '../screens/CategorytList';
import CommunityList from '../screens/CommunityList';
import CommunityHome from '../screens/CommunityHome/index';
import { CommunitySetting } from '../screens/CommunitySetting/index';
import CommunityMemberDetail from '../screens/CommunityMemberDetail/CommunityMemberDetail';
import Home from '../screens/Home';
import PostDetail from '../screens/PostDetail';
import CreatePost from '../screens/CreatePost';
import UserProfile from '../screens/UserProfile/UserProfile';
import { EditProfile } from '../screens/EditProfile/EditProfile';
import UserProfileSetting from '../screens/UserProfileSetting/UserProfileSetting';
import CommunitySearch from '../screens/CommunitySearch';
import AllMyCommunity from '../screens/AllMyCommunity';
import CreateCommunity from '../screens/CreateCommunity';

export default function SocialNavigator() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const { isConnected } = useAuth();

  // const renderPostDeatil = () => {
  //   return <PostDetail />;
  // };
  return (
    <NavigationContainer independent={true}>
      {isConnected && (
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: 'white',
            },

          }}
        >
          <Stack.Screen name="Home" component={Home} />
          {/* <Stack.Screen name="Community" component={Home} /> */}
          <Stack.Screen name="Explore" component={Explore} />
          <Stack.Screen name="PostDetail" component={PostDetail} />
          <Stack.Screen
            name="CategoryList"
            component={CategoryList}
            options={({ }) => ({
              title: 'Category',
            })}
          />
          <Stack.Screen name="CommunityHome" component={CommunityHome} />
          <Stack.Screen
            name="CommunitySearch"
            options={{
              headerShown: false,
            }}
            component={CommunitySearch}
          />
          <Stack.Screen
            name="CommunityMemberDetail"
            component={CommunityMemberDetail}
          />
          <Stack.Screen name="CommunitySetting" component={CommunitySetting} />
          <Stack.Screen name="CreateCommunity" component={CreateCommunity} />
          <Stack.Screen name="CommunityList" component={CommunityList} />
          <Stack.Screen name="AllMyCommunity" component={AllMyCommunity} />
          <Stack.Screen name="CreatePost" component={CreatePost} />
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
