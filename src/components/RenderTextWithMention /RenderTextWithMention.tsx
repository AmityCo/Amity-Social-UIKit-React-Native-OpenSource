import { Text, Linking } from 'react-native';
import { useStyles } from './styles';
import React, { memo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { IMentionPosition } from '../../types/type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/RouteParamList';
import ReadMore from '@fawazahmed/react-native-read-more';

interface IrenderTextWithMention {
  mentionPositionArr: IMentionPosition[];
  textPost: string;
}

interface LinkInfo {
  link: string;
  index: number;
  length: number;
}

const RenderTextWithMention: React.FC<IrenderTextWithMention> = ({
  mentionPositionArr,
  textPost,
}) => {
  const styles = useStyles();
  const navigation =
    useNavigation() as NativeStackNavigationProp<RootStackParamList>;
  const linkArr = useCallback((text: string): LinkInfo[] => {
    const urlRegex = /(https?:\/\/|www\.)[^\s]+/g;
    const links: LinkInfo[] = [];
    let match;
    while ((match = urlRegex.exec(text)) !== null) {
      links.push({
        link: match[0],
        index: match.index,
        length: match[0].length,
      });
    }
    return links;
  }, []);

  const heightlightTextPositions = [
    ...linkArr(textPost),
    ...mentionPositionArr,
  ].sort((a, b) => a.index - b.index) as (IMentionPosition & LinkInfo)[];

  const mentionClick = useCallback(
    (userId: string) => {
      navigation.navigate('UserProfile', {
        userId: userId,
      });
    },
    [navigation]
  );
  const handleLinkClick = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  const handleOnClick = useCallback(
    (link: string, userId: string) => {
      if (link) return handleLinkClick(link);
      return mentionClick(userId);
    },
    [handleLinkClick, mentionClick]
  );

  if (heightlightTextPositions.length === 0) {
    return (
      <ReadMore
        key={textPost}
        numberOfLines={8}
        seeMoreStyle={styles.moreLessButton}
        style={styles.inputText}
        seeLessStyle={styles.moreLessButton}
      >
        {textPost}
      </ReadMore>
    );
  }

  let currentPosition = 0;
  const result: (string | JSX.Element)[][] = heightlightTextPositions.map(
    ({ index, length, userId, link }, i) => {
      // Add non-highlighted text before the mention
      const nonHighlightedText = textPost.slice(currentPosition, index);
      // Add highlighted text
      const highlightedText = (
        <Text
          selectable
          onPress={() => handleOnClick(link, userId)}
          key={`highlighted-${i}`}
          style={styles.mentionText}
        >
          {textPost.slice(index, index + length)}
        </Text>
      );

      // Update currentPosition for the next iteration
      currentPosition = index + length;

      // Return an array of non-highlighted and highlighted text
      return [nonHighlightedText, highlightedText];
    }
  );

  // Add any remaining non-highlighted text after the mentions
  const remainingText = textPost.slice(currentPosition);
  result.push([
    <Text selectable key="nonHighlighted-last" style={styles.inputText}>
      {remainingText}
    </Text>,
  ]);

  // Flatten the array and render
  return (
    <Text selectable style={styles.inputText}>
      {result.flat()}
    </Text>
  );
};

export default memo(RenderTextWithMention);
