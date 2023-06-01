import * as React from 'react';
import { ReactElement, useState } from 'react';
// import { useTranslation } from 'react-i18next';

import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import Video from 'react-native-video';

export default function Explore() {
  return (
    <View style={styles.container}>
      <Video
        style={styles.video}
        source={{
          uri: 'https://api.amity.co/api/v3/files/64746c17473528aca74d7612/download',
        }} // the video file
        paused={false} // make it start
        repeat={true} // make it a loop
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
});
