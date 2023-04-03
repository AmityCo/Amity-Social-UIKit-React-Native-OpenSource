import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  GestureResponderEvent,
} from 'react-native';
import { styles } from './styles';
export default function DoneButton({
  onDonePressed,
}: {
  navigation: any;
  onDonePressed: { (event: GestureResponderEvent): void };
}) {
  return (
    <TouchableOpacity onPress={onDonePressed}>
      <View style={styles.icon}>
        <Text style={styles.doneText}>Done</Text>
      </View>
    </TouchableOpacity>
  );
}
