import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

export default function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}
