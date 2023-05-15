import { NavigationContainer } from '@react-navigation/native';

import * as React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from './RouteParamList';
import useAuth from '../hooks/useAuth';
import Home from '../screens/social/Home';
import Explore from '../screens/social/Explore';
import CategoryList from '../screens/social/CategorytList';

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
          {/* <Stack.Screen name="Home" component={Home} /> */}
          {/* <Stack.Screen name="Community" component={Home} /> */}
          <Stack.Screen name="Explore" component={Explore} />
          <Stack.Screen name="CategoryList" component={CategoryList} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
