import React from 'react';
import {
  ActivityIndicator,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import { styles } from './styles';

export default function LoadingIndicator({
  propStyle,
  size = 20,
  color = 'gray',
}: {
  propStyle?: StyleProp<ViewStyle>;
  size?: number;
  color?: string;
}) {
  let style: StyleProp<ViewStyle> = styles.container;
  if (propStyle !== undefined) {
    style = [styles.container, propStyle];
  }
  return (
    <View style={style}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
