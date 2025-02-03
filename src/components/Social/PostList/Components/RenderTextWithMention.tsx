import { Text } from 'react-native';
import { useStyles } from '../styles';
import React, { memo } from 'react';
import { useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../routes/RouteParamList';
import { IMentionPosition } from '../../../../types/type';

interface IrenderTextWithMention {
  mentionPositionArr: IMentionPosition[];
  textPost: string;
}

const RenderTextWithMention: React.FC<IrenderTextWithMention> = ({
  mentionPositionArr,
  textPost,
}) => {
  const styles = useStyles();
  const navigation =
    useNavigation() as NativeStackNavigationProp<RootStackParamList>;
  if (mentionPositionArr.length === 0) {
    return <Text style={styles.inputText}>{textPost}</Text>;
  }
  const mentionClick = (userId: string) => {
    navigation.navigate('UserProfile', {
      userId: userId,
    });
  };
  let currentPosition = 0;
  const result: (string | JSX.Element)[][] = mentionPositionArr.map(
    ({ index, length, userId }, i) => {
      // Add non-highlighted text before the mention
      const nonHighlightedText = textPost.slice(currentPosition, index);

      // Add highlighted text
      const highlightedText = (
        <Text
          onPress={() => mentionClick(userId)}
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
    <Text key="nonHighlighted-last" style={styles.inputText}>
      {remainingText}
    </Text>,
  ]);

  // Flatten the array and render
  return <Text style={styles.inputText}>{result.flat()}</Text>;
};

export default memo(RenderTextWithMention);
