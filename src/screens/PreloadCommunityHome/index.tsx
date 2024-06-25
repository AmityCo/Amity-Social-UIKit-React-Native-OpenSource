import {
  CommunityRepository,
} from '@amityco/ts-sdk-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, {

  useState,
  useEffect,
} from 'react';
import { View } from 'react-native';
import useAuth from '../../hooks/useAuth';


export default function PreloadCommunityHome() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [defaultCommunityId, setDefaultCommunityId] = useState<string>("")
  const [defaultCommunityName, setDefaultCommunityName] = useState<string>("")
  const { isConnected } = useAuth();


  useEffect(() => {
    if (isConnected) {
      CommunityRepository.getCommunities(
        { membership: 'member', limit: 1 },
        ({ data }) => {

          setDefaultCommunityId(data[0]?.communityId)
          setDefaultCommunityName(data[0]?.displayName)

        }

      )
    }



  }, [isConnected])

  useEffect(() => {
    if (defaultCommunityId && defaultCommunityName) {
      navigation.navigate('CommunityHome', {
        communityId: defaultCommunityId,
        communityName: defaultCommunityName,
        isBackEnabled: false
      });
    }
  }, [defaultCommunityId, defaultCommunityName])


  return (
    <View/>
  );
}
