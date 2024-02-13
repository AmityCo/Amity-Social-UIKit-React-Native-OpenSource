import { Text, TextInput, View, TextInputProps } from 'react-native';
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { useStyles } from './styles';
import MentionPopup from '../MentionPopup';
import { ISearchItem } from '../SearchItem';
import { IMentionPosition } from '../../screens/CreatePost';

interface IMentionInput extends TextInputProps {
  inputMessage: string;
  setInputMessage: (inputMessage: string) => void;
  mentionsPosition: IMentionPosition[];
  setMentionsPosition: (mentionsPosition: IMentionPosition[]) => void;
  mentionUsers: ISearchItem[];
  setMentionUsers: (mentionUsers: ISearchItem[]) => void;
}

const MentionInput: FC<IMentionInput> = ({
  inputMessage,
  setInputMessage,
  mentionsPosition,
  setMentionsPosition,
  mentionUsers,
  setMentionUsers,
  ...rest
}) => {
  const styles = useStyles();
  const [cursorIndex, setCursorIndex] = useState(0);
  const [isShowMention, setIsShowMention] = useState<boolean>(false);
  const [currentSearchUserName, setCurrentSearchUserName] = useState('');

  const checkMention = useCallback(
    (inputString: string) => {
      const startsWithAt = /^@/.test(inputString);
      const insideWithoutLetterBefore = /[^a-zA-Z]@/.test(inputString);
      const atSigns = inputString.match(/@/g);
      const atSignsNumber = atSigns ? atSigns.length : 0;
      if (
        (startsWithAt || insideWithoutLetterBefore) &&
        atSignsNumber > mentionUsers.length
      ) {
        setIsShowMention(true);
      } else {
        setIsShowMention(false);
      }
    },
    [mentionUsers.length]
  );
  useEffect(() => {
    checkMention(inputMessage);
  }, [checkMention, inputMessage]);

  useEffect(() => {
    if (isShowMention) {
      const substringBeforeCursor = inputMessage.substring(0, cursorIndex);
      const lastAtsIndex = substringBeforeCursor.lastIndexOf('@');
      if (lastAtsIndex !== -1) {
        const searchText: string = inputMessage.substring(
          lastAtsIndex + 1,
          cursorIndex + 1
        );
        setCurrentSearchUserName(searchText);
      }
    }
  }, [cursorIndex, inputMessage, isShowMention]);

  const renderTextWithMention = () => {
    if (mentionsPosition.length === 0) {
      return <Text style={styles.inputText}>{inputMessage}</Text>;
    }
    let currentPosition = 0;
    const result = mentionsPosition.map(({ index, length }, i) => {
      const nonHighlightedText = inputMessage.slice(currentPosition, index);

      const highlightedText = (
        <Text key={i} style={styles.mentionText}>
          {inputMessage.slice(index, index + length)}
        </Text>
      );
      currentPosition = index + length;
      return [nonHighlightedText, highlightedText];
    });
    const remainingText = inputMessage.slice(currentPosition);
    result.push([
      <Text key="nonHighlighted-last" style={styles.inputText}>
        {remainingText}
      </Text>,
    ]);
    return <Text style={styles.inputText}>{result.flat()}</Text>;
  };

  const handleSelectionChange = (event) => {
    setCursorIndex(event.nativeEvent.selection.start);
  };

  const onSelectUserMention = (user: ISearchItem) => {
    const textAfterCursor: string = inputMessage.substring(
      cursorIndex,
      inputMessage.length + 1
    );
    const newTextAfterReplacement =
      inputMessage.slice(0, cursorIndex - currentSearchUserName.length) +
      user.displayName +
      inputMessage.slice(cursorIndex, inputMessage.length);
    const newInputMessage = newTextAfterReplacement + textAfterCursor;
    const position: IMentionPosition = {
      type: 'user',
      length: user.displayName.length + 1,
      index: cursorIndex - 1 - currentSearchUserName.length,
      userId: user.targetId,
      displayName: user.displayName,
    };
    const newMentionUsers = [...mentionUsers, user];
    const newMentionPosition = [...mentionsPosition, position];
    setInputMessage(newInputMessage);
    setMentionUsers(newMentionUsers);
    setMentionsPosition(newMentionPosition);
    setCurrentSearchUserName('');
  };

  return (
    <>
      <TextInput
        style={
          mentionUsers.length > 0
            ? [styles.textInput, styles.transparentText]
            : styles.textInput
        }
        value={inputMessage}
        onChangeText={(text) => setInputMessage(text)}
        onSelectionChange={handleSelectionChange}
        {...rest}
      />
      {mentionUsers.length > 0 && (
        <View style={styles.overlay}>{renderTextWithMention()}</View>
      )}
      {isShowMention && (
        <MentionPopup
          userName={currentSearchUserName}
          onSelectMention={onSelectUserMention}
        />
      )}
    </>
  );
};

export default memo(MentionInput);
