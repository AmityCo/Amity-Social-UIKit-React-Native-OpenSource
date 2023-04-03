import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { styles } from './styles';

interface LoadingOverlayProps {
  isLoading: boolean;
  loadingText: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  loadingText,
}) => {
  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>{loadingText}</Text>
      </View>
    </View>
  );
};
