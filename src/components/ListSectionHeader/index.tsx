import React from 'react';
import { Text, View } from 'react-native';
import { useStyle } from './styles';

export default function SectionHeader({ title }: { title: string }) {
  const styles = useStyle();
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}
