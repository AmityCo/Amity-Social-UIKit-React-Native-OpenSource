import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

export default function RoundCheckbox({ isChecked }: { isChecked: boolean }) {
  return (
    <View style={[styles.roundCheckbox, isChecked && styles.checked]}>
      {isChecked && <Text style={styles.checkmark}>✓</Text>}
    </View>
  );
}
