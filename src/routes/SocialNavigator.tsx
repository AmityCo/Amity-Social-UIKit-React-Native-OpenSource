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
import CommunityHome from '../v4/screen/CommunityHome';
import { CommunitySetting } from '../screens/CommunitySetting/index';
import CommunityMemberDetail from '../screens/CommunityMemberDetail/CommunityMemberDetail';
import AmitySocialHomePage from '../v4/PublicApi/AmitySocialHomePage/AmitySocialHomePage';
import PostDetail from '../screens/PostDetail';
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
import { Image, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { closeIcon } from '../svg/svg-xml-list';
import { useStyles } from '../routes/style';
import BackButton from '../components/BackButton';
import CloseButton from '../components/CloseButton';
import EditCommunity from '../screens/EditCommunity/EditCommunity';
import VideoPlayerFull from '../screens/VideoPlayerFullScreen';
import PostTypeChoiceModal from '../components/PostTypeChoiceModal/PostTypeChoiceModal';
import CreatePoll from '../screens/CreatePoll/CreatePoll';
import ReactionListScreen from '../screens/ReactionListScreen/ReactionListScreen';
import CreateStoryScreen from '../v4/screen/CreateStory/CreateStoryScreen';
import Toast from '../components/Toast/Toast';
import AmitySocialHomeTopNavigationComponent from './Components/AmitySocialHomeTopNavigationComponent';

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
          <Stack.Screen
            name="Home"
            component={AmitySocialHomePage}
            options={{
              headerTitle: () => {
                return <AmitySocialHomeTopNavigationComponent />;
              },
            }}
          />
          <Stack.Screen name="Explore" component={Explore} />
          <Stack.Screen
            name="PostDetail"
            component={PostDetail}
            options={{
              headerLeft: () => <BackButton />,
              title: '',
            }}
          />
          <Stack.Screen
            name="CategoryList"
            component={CategoryList}
            options={({}) => ({
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
              headerLeft: () => (
                <BackButton
                  onPress={() => {
                    navigation.navigate('Home');
                  }}
                />
              ),
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
                  <Image
                    source={require('../../assets/icon/threeDot.png')}
                    style={styles.dotIcon}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="PendingPosts"
            component={PendingPosts}
            options={{ title: 'Pending Posts' }}
          />
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
            options={({
              navigation,
            }: {
              navigation: NativeStackNavigationProp<any>;
            }) => ({
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={styles.btnWrap}
                >
                  <SvgXml
                    xml={closeIcon(theme.colors.base)}
                    width="15"
                    height="15"
                  />
                </TouchableOpacity>
              ),
            })}
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
          <Stack.Screen
            name="VideoPlayer"
            component={VideoPlayerFull}
            options={{ headerShown: false }}
          />

          <Stack.Group
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_bottom',
            }}
          >
            <Stack.Screen
              name="ReactionList"
              component={ReactionListScreen}
              options={{
                headerShown: true,
                title: 'Reactions',
                headerLeft: () => <BackButton />,
              }}
            />
            <Stack.Screen name="CreateStory" component={CreateStoryScreen} />
          </Stack.Group>
        </Stack.Navigator>
      )}
      <PostTypeChoiceModal />
      <Toast />
    </NavigationContainer>
  );
}
