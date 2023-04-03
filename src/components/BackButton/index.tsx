import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './styles';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'react-native';
interface IBackBtn {
  onPress: () => any;
}
export default function BackButton({ onPress }: IBackBtn) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
        onPress && onPress();
      }}
    >
      <Image
        style={styles.icon}
        source={require('../../../assets/icon/BackIcon.png')}
      />
    </TouchableOpacity>
  );
}
