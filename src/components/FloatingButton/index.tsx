import React from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { postIcon } from '../../svg/svg-xml-list';
import { styles } from './styles';

interface IBackBtn {
  onPress: () => any;
  isGlobalFeed?: boolean;
}
export default function FloatingButton({
  onPress,
  isGlobalFeed = true,
}: IBackBtn) {
  return (
    <View style={!isGlobalFeed ? styles.otherFeedContainer : styles.container}>
      <Pressable
        onPress={() => {
          onPress && onPress();
        }}
        style={styles.button}
      >
        <TouchableOpacity
          onPress={() => {
            onPress && onPress();
          }}
        >
          <SvgXml xml={postIcon('#FFFFFF')} width="30" height="30" />
        </TouchableOpacity>
      </Pressable>
    </View>
  );
}
