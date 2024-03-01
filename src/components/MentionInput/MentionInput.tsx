import { View, TextInputProps, FlatList } from 'react-native';
import React, { FC, memo, useCallback, useState } from 'react';
import { useStyles } from './styles';
import SearchItem, { ISearchItem } from '../SearchItem';
import { IMentionPosition } from '../../screens/CreatePost';
import {
  MentionSuggestionsProps,
  MentionInput as MentionTextInput,
  replaceMentionValues,
} from 'react-native-controlled-mentions';
import useSearch from '../../hooks/useSearch';

interface IMentionInput extends TextInputProps {
  setInputMessage: (inputMessage: string) => void;
  mentionsPosition: IMentionPosition[];
  setMentionsPosition: (mentionsPosition: IMentionPosition[]) => void;
  mentionUsers: ISearchItem[];
  setMentionUsers: (mentionUsers: ISearchItem[]) => void;
}

const MentionInput: FC<IMentionInput> = ({
  setInputMessage,
  mentionsPosition,
  setMentionsPosition,
  mentionUsers,
  setMentionUsers,
  ...rest
}) => {
  const styles = useStyles();
  const [cursorIndex, setCursorIndex] = useState(0);
  const [currentSearchUserName, setCurrentSearchUserName] = useState('');
  const { searchResult, getNextPage } = useSearch(currentSearchUserName);
  const [value, setValue] = useState<string>();
  const handleSelectionChange = (event) => {
    setCursorIndex(event.nativeEvent.selection.start);
  };

  const onSelectUserMention = useCallback(
    (user: ISearchItem) => {
      const position: IMentionPosition = {
        type: 'user',
        length: user.displayName.length + 1,
        index: cursorIndex - 1 - currentSearchUserName.length,
        userId: user.id,
        displayName: user.displayName,
      };
      const newMentionUsers = [...mentionUsers, user];
      const newMentionPosition = [...mentionsPosition, position];
      setMentionUsers(newMentionUsers);
      setMentionsPosition(newMentionPosition);
      setCurrentSearchUserName('');
    },
    [
      currentSearchUserName,
      cursorIndex,
      mentionUsers,
      mentionsPosition,
      setMentionUsers,
      setMentionsPosition,
    ]
  );

  const onChangeInput = useCallback(
    (text: string) => {
      setValue(text);
      const data = replaceMentionValues(text, ({ name }) => `@${name}`);
      setInputMessage(data);
    },
    [setInputMessage]
  );

  const renderSuggestions: FC<MentionSuggestionsProps> = useCallback(
    ({ keyword, onSuggestionPress }) => {
      setCurrentSearchUserName(keyword);
      if (keyword == null || !searchResult || searchResult?.length === 0) {
        return null;
      }
      return (
        <View style={styles.mentionListContainer}>
          <FlatList
            onEndReached={() => getNextPage && getNextPage()}
            nestedScrollEnabled={true}
            data={searchResult}
            renderItem={({ item }) => {
              return (
                <SearchItem
                  target={item}
                  onPress={() => {
                    onSelectUserMention(item);
                    onSuggestionPress(item);
                  }}
                  userProfileNavigateEnabled={false}
                />
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </View>
      );
    },
    [
      getNextPage,
      onSelectUserMention,
      searchResult,
      styles.mentionListContainer,
    ]
  );
  return (
    <MentionTextInput
      {...rest}
      value={value}
      onChange={onChangeInput}
      onSelectionChange={handleSelectionChange}
      partTypes={[
        {
          isBottomMentionSuggestionsRender: true,
          trigger: '@',
          renderSuggestions,
          textStyle: styles.mentionText,
        },
      ]}
    />
  );
};

export default memo(MentionInput);
