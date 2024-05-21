import React from 'react';
import { Text, View } from 'react-native';
import { useStyle } from './styles';

export default function RoundCheckbox({ isChecked }: { isChecked: boolean }) {
  const styles = useStyle();
  return (
    <View style={[styles.roundCheckbox, isChecked && styles.checked]}>
      {isChecked && <Text style={styles.checkmark}>✓</Text>}
    </View>
  );
}
