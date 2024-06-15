import React from 'react';
import { Pressable, View } from 'react-native';
import { styles } from './styles';
import PostIcon from '../../svg/PostIcon';

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
       <PostIcon color='#fff'/>
      </Pressable>
    </View>
  );
}
