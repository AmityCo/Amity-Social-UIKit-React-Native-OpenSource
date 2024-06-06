import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useStyles } from './styles';

import { AmityStreamPlayer } from '@amityco/video-player-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '~/redux/store';
import LivestreamEndedView from '../../components/LivestreamSection/LivestreamEndedView';
import { Animated } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { closeIcon, pauseIcon, playIcon } from '../../svg/svg-xml-list';

const LiveStreamPlayer = () => {
  const navigation = useNavigation();
  const ref = useRef<any>(null);
  const styles = useStyles();

  const showControlAnim = useRef(new Animated.Value(0)).current; // 0 for 'false', 1 for 'true'

  const [isPlaying, setIsPlaying] = useState(true);

  const { data: stream } = useSelector((state: RootState) => state.stream);

  const onStopPlayer = () => {
    ref.current && ref.current.pause();
    setIsPlaying(false);
  };

  const onStartPlayer = () => {
    ref.current && ref.current.play();
    setIsPlaying(true);
  };

  const onPressControlButton = () => {
    isPlaying ? onStopPlayer() : onStartPlayer();
  };

  const onToggleControl = () => {
    Animated.timing(showControlAnim, {
      toValue:
        (showControlAnim as Animated.Value & { _value: number })._value === 0
          ? 1
          : 0, // toggle between 0 and 1
      duration: 500, // duration of the animation
      useNativeDriver: false, // change this to true if you're animating opacity or transform
    }).start();
  };

  return (
    <View style={styles.container}>
      {stream && stream.status === 'ended' ? (
        <>
          <View style={styles.streamEndedWrap}>
            <LivestreamEndedView />
          </View>
        </>
      ) : (
        <>
          <AmityStreamPlayer stream={stream} ref={ref} />
          <View style={styles.topSectionWrap}>
            <View style={styles.status}>
              <Text style={styles.statusText}>LIVE</Text>
            </View>
          </View>
          <TouchableWithoutFeedback onPress={onToggleControl}>
            <Animated.View style={{ opacity: showControlAnim }}>
              <View style={styles.closeButton}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={navigation.goBack}
                >
                  <SvgXml xml={closeIcon('#FFFFFF')} width="16" height="16" />
                </TouchableOpacity>
              </View>

              <View style={styles.controller}>
                <TouchableOpacity
                  onPress={onPressControlButton}
                  style={styles.controllerButton}
                >
                  <SvgXml
                    xml={isPlaying ? pauseIcon() : playIcon()}
                    width={24}
                    height={60}
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </>
      )}
    </View>
  );
};

export default LiveStreamPlayer;
