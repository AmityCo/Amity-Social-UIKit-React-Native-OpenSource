import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  type GestureResponderEvent,
} from 'react-native';
import { styles } from './styles';
export default function DoneButton({
  onDonePressed,
  buttonTxt,
}: {
  navigation: any;
  buttonTxt?: string;
  onDonePressed: { (event: GestureResponderEvent): void };
}) {
  const buttonText = buttonTxt ?? 'Done';
  return (
    <TouchableOpacity onPress={onDonePressed}>
      <View style={styles.icon}>
        <Text style={styles.doneText}>{buttonText}</Text>
      </View>
    </TouchableOpacity>
  );
}
