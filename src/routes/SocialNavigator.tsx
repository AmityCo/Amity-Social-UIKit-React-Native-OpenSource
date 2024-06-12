/* eslint-disable react/no-unstable-nested-components */
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import type { RootStackParamList } from './RouteParamList';
import useAuth from '../hooks/useAuth';
import Explore from '../screens/Explore';
import CategoryList from '../screens/CategorytList';
import CommunityList from '../screens/CommunityList';
import CommunityHome from '../screens/CommunityHome/index';
import { CommunitySetting } from '../screens/CommunitySetting/index';
import CommunityMemberDetail from '../screens/CommunityMemberDetail/CommunityMemberDetail';
import Home from '../screens/Home';
import PostDetail from '../screens/AmityPostDetailPage/AmityPostDetailPage';
import CreatePost from '../screens/CreatePost';
import UserProfile from '../screens/UserProfile/UserProfile';
import { EditProfile } from '../screens/EditProfile/EditProfile';
import UserProfileSetting from '../screens/UserProfileSetting/UserProfileSetting';
import CommunitySearch from '../screens/CommunitySearch';
import AllMyCommunity from '../screens/AllMyCommunity';
import CreateCommunity from '../screens/CreateCommunity';
import PendingPosts from '../screens/PendingPosts';
import type { MyMD3Theme } from '../providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import { useStyles } from '../routes/style';
import BackButton from '../components/BackButton';
import CloseButton from '../components/CloseButton';
import EditCommunity from '../screens/EditCommunity/EditCommunity';
// import VideoPlayerFull from '../screens/VideoPlayerFullScreen';
import PostTypeChoiceModal from '../components/PostTypeChoiceModal/PostTypeChoiceModal';
import CreatePoll from '../screens/CreatePoll/CreatePoll';
import { ThreeDotsIcon } from '../svg/ThreeDotsIcon';

export default function SocialNavigator() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const { isConnected } = useAuth();
  const theme = useTheme() as MyMD3Theme;

  const styles = useStyles();
  return (
    <NavigationContainer independent={true}>
      {isConnected && (
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: 'white',
            },
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTitleStyle: {
              color: theme.colors.base,
            },
          }}
        >
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Community" component={Home} />
          <Stack.Screen name="Explore" component={Explore} />
          <Stack.Screen name="PostDetail" component={PostDetail}
            options={{
              headerShown: false,
            }} />
          <Stack.Screen
            name="CategoryList"
            component={CategoryList}
            options={({ }) => ({
              title: 'Category',
            })}
          />
          <Stack.Screen
            name="CommunityHome"
            component={CommunityHome}
            options={({
              navigation,
              route: {
                params: { communityName, communityId, isModerator },
              },
            }: any) => ({
              headerLeft: () => <BackButton />,
              title: communityName,
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => {
                    // Handle button press here
                    navigation.navigate('CommunitySetting', {
                      communityId: communityId,
                      communityName: communityName,
                      isModerator: isModerator,
                    });
                  }}
                >
                  <ThreeDotsIcon style={styles.dotIcon} />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen name="PendingPosts" component={PendingPosts} />
          <Stack.Screen
            name="CommunitySearch"
            component={CommunitySearch}
            options={{
              headerShown: false, // Remove the back button
            }}
          />
          <Stack.Screen
            name="CommunityMemberDetail"
            component={CommunityMemberDetail}
            options={{
              headerLeft: () => <BackButton />,
              headerTitleAlign: 'center',
              title: 'Member',
            }}
          />
          <Stack.Screen
            name="CommunitySetting"
            component={CommunitySetting}
            options={({
              route: {
                params: { communityName },
              },
            }: any) => ({
              title: communityName,
              headerTitleAlign: 'center',
              headerLeft: () => <BackButton />,
            })}
          />
          <Stack.Screen name="CreateCommunity" component={CreateCommunity} />
          <Stack.Screen name="CommunityList" component={CommunityList} />
          <Stack.Screen
            name="AllMyCommunity"
            component={AllMyCommunity}
          />
          <Stack.Screen
            name="CreatePost"
            component={CreatePost}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreatePoll"
            component={CreatePoll}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserProfile"
            component={UserProfile}
            options={{
              title: '',
              headerLeft: () => <BackButton />,
            }}
          />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen
            name="EditCommunity"
            component={EditCommunity}
            options={({
              navigation,
            }: {
              navigation: NativeStackNavigationProp<any>;
            }) => ({
              headerLeft: () => <CloseButton navigation={navigation} />,
              title: 'Edit Profile',
              headerTitleAlign: 'center',
            })}
          />
          <Stack.Screen
            name="UserProfileSetting"
            component={UserProfileSetting}
          />
          {/* <Stack.Screen
            name="VideoPlayer"
            component={VideoPlayerFull}
            options={{ headerShown: false }}
          /> */}
        </Stack.Navigator>
      )}
      <PostTypeChoiceModal />
    </NavigationContainer>
  );
}
