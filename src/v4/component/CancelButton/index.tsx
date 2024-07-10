import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useStyles } from './styles';
import { useNavigation } from '@react-navigation/native';

export default function CancelButton() {
  const navigation = useNavigation();
  const styles = useStyles();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <View style={styles.icon}>
        <Text style={styles.cancelText}>Cancel</Text>
      </View>
    </TouchableOpacity>
  );
}
