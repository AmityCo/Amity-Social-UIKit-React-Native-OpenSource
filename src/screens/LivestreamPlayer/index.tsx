import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
// import { NodePlayer } from 'react-native-nodemediaclient';
import { useStyles } from './styles';
import { playIcon, pauseIcon } from '../../../src/svg/svg-xml-list';
import { SvgXml } from 'react-native-svg';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../routes/RouteParamList';
import { StreamRepository } from '@amityco/ts-sdk-react-native';
import LivestreamEndedView from '../../components/LivestreamSection/LivestreamEndedView';
import { closeIcon } from '../../svg/svg-xml-list';

type LivestreamFormatWithRTMP = Pick<
  Amity.Stream,
  'watcherUrl'
>['watcherUrl'] & {
  rtmp?: {
    url: string;
    components: {
      origin: string;
      appName: string;
      streamName: string;
      query: string;
    };
  };
};

type LivestreamWithRTMP = Omit<Amity.Stream, 'watcherUrl'> & {
  watcherUrl: LivestreamFormatWithRTMP;
};

const LiveStreamPlayer = () => {
  const ref = useRef(null);
  const styles = useStyles();
  const route = useRoute<RouteProp<RootStackParamList, 'LivestreamPlayer'>>();

  const { streamId } = route.params;

  const [stream, setStream] = useState<LivestreamWithRTMP>();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const naviation = useNavigation();

  const onStopPlayer = () => {
    ref.current.stop();
    setIsPlaying(false);
  };

  const onStartPlayer = () => {
    ref.current.start();
    setIsPlaying(true);
  };

  const onPressControlButton = () => {
    isPlaying ? onStopPlayer() : onStartPlayer();
  };

  useEffect(() => {
    const unsubscribe = StreamRepository.getStreamById(
      streamId,
      ({ data, loading }) => {
        if (!loading && data) setStream(data);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [streamId]);

  return (
    <View style={styles.container}>
      <View style={styles.closeButton}>
        <TouchableOpacity style={styles.closeButton} onPress={naviation.goBack}>
          <SvgXml xml={closeIcon('#FFFFFF')} width="16" height="16" />
        </TouchableOpacity>
      </View>
      {stream && stream.status && stream.status === 'ended' ? (
        <>
          <View style={styles.streamEndedWrap}>
            <LivestreamEndedView />
          </View>
        </>
      ) : (
        <>
          <View style={styles.topSectionWrap}>
            <View style={styles.status}>
              <Text style={styles.statusText}>LIVE</Text>
            </View>
          </View>
          {/* {stream && stream.watcherUrl && (
            <NodePlayer
              ref={ref}
              style={{ flex: 1 }}
              url={stream.watcherUrl.rtmp.url}
              autoplay={true}
              scaleMode={1}
              bufferTime={500}
            />
          )} */}
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
        </>
      )}
    </View>
  );
};

export default LiveStreamPlayer;
