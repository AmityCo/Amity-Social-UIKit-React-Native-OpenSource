import * as React from 'react';
import {
  Image,
  LayoutAnimation,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useStyles } from './styles';
import { PreviewDataImage } from './types';
import { getPreviewData } from './utils';
import { IMentionPosition } from '../../types/type';
import RenderTextWithMention from '../RenderTextWithMention /RenderTextWithMention';


export interface LinkPreviewProps {
  text: string;
  mentionPositionArr: IMentionPosition[];
}

export const LinkPreview = React.memo(
  ({ text, mentionPositionArr }: LinkPreviewProps) => {
    const [data, setData] = React.useState(null);

    const styles = useStyles();
    React.useEffect(() => {
      let isCancelled = false;

      const fetchData = async () => {
        setData(undefined);
        const newData = await getPreviewData(text, 5000);
        if (!isCancelled) {
          LayoutAnimation.easeInEaseOut();
          setData(newData);
        }
      };

      fetchData();
      return () => {
        isCancelled = true;
      };
    }, [text]);

    const handlePress = () => data?.link && Linking.openURL(data.link);

    const renderImageNode = React.useCallback(
      (image: PreviewDataImage) => {
        const imageUrl = image?.url
          ? { uri: image.url }
          : require('../../assets/icon/previewLinkDefaultBackground.png');

        return (
          <Image
            accessibilityRole="image"
            resizeMode="cover"
            source={imageUrl}
            style={styles.image}
          />
        );
      },
      [styles.image]
    );

    const renderTitleNode = (title: string) => {
      return (
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      );
    };

    const renderShortUrl = (url: string) => {
      const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
      const shortUrl = matches ? matches[1] : '';
      return (
        <Text numberOfLines={1} style={styles.shortUrl}>
          {shortUrl}
        </Text>
      );
    };
    return (
      <View>
        <RenderTextWithMention
          textPost={text}
          mentionPositionArr={mentionPositionArr}
        />
        {data?.link && (
          <TouchableOpacity
            onPress={handlePress}
            style={styles.metadataContainer}
          >
            {renderImageNode(data.image)}
            <View style={styles.metadataTextContainer}>
              {data?.link && renderShortUrl(data.link)}
              {data?.title && renderTitleNode(data.title)}
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
);
