import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';

import { View } from 'react-native';
import Video from 'react-native-video';
import type { RootStackParamList } from '../../routes/RouteParamList';
import { useRoute, type RouteProp, useNavigation } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import { closeIcon } from '../../svg/svg-xml-list';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from './styles';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';


const VideoPlayerFull = () => {
  const theme = useTheme() as MyMD3Theme;
  const route = useRoute<RouteProp<RootStackParamList, 'VideoPlayer'>>();
  const { source } = route.params
  const videoRef = useRef(null);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [orientation, setOrientation] = useState('LANDSCAPE');

  const determineAndSetOrientation = () => {
    let width = Dimensions.get('window').width;
    let height = Dimensions.get('window').height;

    if (width < height) {
      setOrientation('PORTRAIT');
    } else {
      setOrientation('LANDSCAPE');
    }
  }

  useEffect(() => {

    determineAndSetOrientation();
    Dimensions.addEventListener('change', determineAndSetOrientation);

  }, []);

  const onClose = () => {
    navigation.goBack()
  }
  return (
    <View style={styles.container}>


      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <SvgXml xml={closeIcon(theme.colors.base)} width="16" height="16" />
      </TouchableOpacity>
      <Video
        ref={videoRef}
        source={{ uri: source }}
        style={orientation === 'LANDSCAPE' ? styles.videoLandscape : styles.video}
        resizeMode='contain'
        controls={true}
      />

    </View>
  );
};



export default VideoPlayerFull;