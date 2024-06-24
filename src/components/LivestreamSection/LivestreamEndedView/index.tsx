import React from 'react';
import { View, Text } from 'react-native';
import { useStyles } from './styles';

const LivestreamEndedView = () => {
  const styles = useStyles();
  return (
    <View style={styles.streamEndedContainer}>
      <Text style={styles.streamNotAvailableTitle}>
        This livestream has ended.
      </Text>
      <Text style={styles.streamNotAvailableDescription}>
        {'Playback will be available for you \nto watch shortly.'}
      </Text>
    </View>
  );
};

export default LivestreamEndedView;
