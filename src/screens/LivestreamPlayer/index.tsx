import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useStyles } from './styles';

import { AmityStreamPlayer } from '@amityco/video-player-react-native';

import LivestreamEndedView from '../../components/LivestreamSection/LivestreamEndedView';
import { Animated } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { closeIcon, playIcon, stopIcon } from '../../svg/svg-xml-list';
import { StreamRepository } from '@amityco/ts-sdk-react-native';

const LiveStreamPlayer = ({ navigation, route }) => {
  const ref = useRef<any>(null);
  const styles = useStyles();

  const showControlAnim = useRef(new Animated.Value(0)).current; // 0 for 'false', 1 for 'true'

  const [isPlaying, setIsPlaying] = useState(true);

  const { streamId } = route.params;

  const [livestream, setLivestream] = useState<Amity.Stream>();

  const onClosePlayer = () => {
    navigation.goBack();
  };

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

  useEffect(() => {
    const getLivestream = () => {
      return StreamRepository.getStreamById(
        streamId,
        ({ data, loading, error }) => {
          if (error) console.error('Error fetching livestream', error);
          if (!loading && data) {
            setLivestream({ ...data });
          }
        }
      );
    };

    const unsubscribe = getLivestream();

    return () => {
      unsubscribe();
    };
  }, [streamId]);

  return (
    <View style={styles.container}>
      <>
        {livestream && (
          <>
            {livestream.status === 'ended' ? (
              <View style={styles.streamEndedWrap}>
                <LivestreamEndedView />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={navigation.goBack}
                >
                  <SvgXml xml={closeIcon('#FFFFFF')} width="16" height="16" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <AmityStreamPlayer
                  stream={livestream}
                  status={livestream.status === 'live' ? 'live' : 'recorded'}
                  ref={ref}
                />
                {livestream.status === 'live' && (
                  <>
                    <View style={styles.topSectionWrap}>
                      <View style={styles.status}>
                        <Text style={styles.statusText}>LIVE</Text>
                      </View>
                    </View>
                    <TouchableWithoutFeedback onPress={onToggleControl}>
                      <Animated.View
                        style={{
                          opacity: showControlAnim,
                        }}
                      >
                        <TouchableOpacity
                          style={styles.closeButton}
                          onPress={navigation.goBack}
                        >
                          <SvgXml
                            xml={closeIcon('#FFFFFF')}
                            width="16"
                            height="16"
                          />
                        </TouchableOpacity>

                        <View style={styles.controller}>
                          <TouchableOpacity
                            onPress={onPressControlButton}
                            style={styles.controllerButton}
                          >
                            {isPlaying ? (
                              <SvgXml xml={stopIcon()} width={32} height={32} />
                            ) : (
                              <SvgXml xml={playIcon()} width={32} height={64} />
                            )}
                          </TouchableOpacity>
                        </View>
                      </Animated.View>
                    </TouchableWithoutFeedback>
                  </>
                )}
                {livestream.status === 'recorded' && (
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClosePlayer}
                  >
                    {/*  */}
                    <SvgXml xml={closeIcon('#FFFFFF')} width="16" height="16" />
                  </TouchableOpacity>
                )}
              </>
            )}
          </>
        )}
      </>
    </View>
  );
};

export default LiveStreamPlayer;
