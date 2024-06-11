import { Text } from 'react-native';
import { useStyles } from './styles';
import React, { memo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { IMentionPosition } from '../../types/type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/RouteParamList';
import { MoreOrLess } from '@rntext/more-or-less';

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
    return (
      <MoreOrLess
        moreText="See More"
        textStyle={styles.inputText}
        numberOfLines={7}
        lessText="See Less"
        textButtonStyle={{ color: '#1054DE' }}
      >
        {textPost}
      </MoreOrLess>
    );
  }
  const mentionClick = (userId: string) => {
    navigation.navigate('UserProfile', {
      userId: userId,
    });
  };
  let currentPosition = 0;
  const result: (string | JSX.Element)[][] = mentionPositionArr.map(
    ({ index, length, userId }, i) => {
      const nonHighlightedText = textPost.slice(currentPosition, index);
      const highlightedText = (
        <Text
          onPress={() => mentionClick(userId)}
          key={`highlighted-${i}`}
          style={styles.mentionText}
        >
          {textPost.slice(index, index + length)}
        </Text>
      );
      currentPosition = index + length;
      return [nonHighlightedText, highlightedText];
    }
  );
  const remainingText = textPost.slice(currentPosition);
  result.push([
    <Text key="nonHighlighted-last" style={styles.inputText}>
      {remainingText}
    </Text>,
  ]);
  return (
    <MoreOrLess
      moreText="See More"
      textStyle={styles.inputText}
      numberOfLines={7}
      lessText="See Less"
      textButtonStyle={{ color: '#1054DE' }}
    >
      {result.flat() as unknown as string}
    </MoreOrLess>
  );
};

export default memo(RenderTextWithMention);
