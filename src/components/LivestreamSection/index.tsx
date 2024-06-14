import {
  Image,
  TouchableOpacity,
  View,
  Text,
  ImageSourcePropType,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { FileRepository, StreamRepository } from '@amityco/ts-sdk-react-native';
import { useStyles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../routes/RouteParamList';
import { SvgXml } from 'react-native-svg';
import { exclamationIcon, playBtn } from '../../svg/svg-xml-list';
import LivestreamEndedView from './LivestreamEndedView';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface ILivestreamSection {
  streamId: Amity.Stream['streamId'];
}

const LivestreamSection: React.FC<ILivestreamSection> = ({ streamId }) => {
  const styles = useStyles();

  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, 'VideoPlayer'>
    >();

  const [livestream, setLivestream] = useState<Amity.Stream>();
  const [thumbnailUrl, setThumbnailUrl] = useState<ImageSourcePropType>();

  const onPlayLivestream = useCallback(() => {
    if (!livestream) return;

    navigation.navigate('LivestreamPlayer', { streamId: livestream.streamId });
  }, [livestream, navigation]);

  const getLivestreamThumbnail = async (currentStream: Amity.Stream) => {
    const defaultThumbnail = require('../../../assets/images/default-livestream-thumbnail.png');

    if (currentStream.thumbnailFileId) {
      const file = await FileRepository.getFile(currentStream.thumbnailFileId);

      if (file) {
        const fileUrl = FileRepository.fileUrlWithSize(
          file.data.fileUrl,
          'full'
        );

        setThumbnailUrl({ uri: fileUrl });
        return;
      }
    }
    setThumbnailUrl(defaultThumbnail);
  };

  useEffect(() => {
    const unsub = StreamRepository.getStreamById(
      streamId,
      ({ data, loading, error }) => {
        if (error) console.error('Error fetching livestream', error);
        if (!loading && data) {
          setLivestream({ ...data });
          getLivestreamThumbnail(data);
        }
      }
    );

    return () => {
      unsub();
    };
  }, [streamId]);

  if (livestream) {
    return (
      <View>
        {!livestream.isLive && livestream.status === 'idle' && (
          <View
            key={livestream.streamId}
            style={styles.streamUnavaliableContainer}
          >
            <SvgXml xml={exclamationIcon('#FFFFFF')} width="28" height="28" />
            <Text style={styles.streamNotAvailableDescription}>
              {'This stream is currently \nunavailable'}
            </Text>
          </View>
        )}

        {livestream.status === 'ended' && (
          <View style={styles.streamEndedContainer}>
            <LivestreamEndedView key={livestream.streamId} />
          </View>
        )}

        {(livestream.status === 'live' || livestream.status === 'recorded') &&
          thumbnailUrl && (
            <View>
              <View
                key={livestream.streamId}
                style={styles.streamLiveContainer}
              >
                <Image source={thumbnailUrl} style={styles.streamImageCover} />
                <View style={styles.streamStatusLive}>
                  <Text style={styles.streamStatusText}>
                    {livestream.status === 'live' ? 'LIVE' : 'RECORDED'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.streamPlayButton}
                  onPress={onPlayLivestream}
                >
                  <SvgXml xml={playBtn} width="50" height="50" />
                </TouchableOpacity>
              </View>
            </View>
          )}
      </View>
    );
  }

  return null;
};

export default React.memo(LivestreamSection);
