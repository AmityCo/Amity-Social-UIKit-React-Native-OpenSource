import { View, TextInputProps, FlatList, TextInput } from 'react-native';
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { useStyles } from './styles';
import SearchItem from '../SearchItem';
import { IMentionPosition } from '../../screens/CreatePost';
import {
  MentionSuggestionsProps,
  MentionInput as MentionTextInput,
  replaceMentionValues,
} from 'react-native-controlled-mentions';
import useSearch, { TSearchItem } from '../../hooks/useSearch';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

interface IMentionInput extends TextInputProps {
  setInputMessage: (inputMessage: string) => void;
  mentionsPosition: IMentionPosition[];
  setMentionsPosition: (mentionsPosition: IMentionPosition[]) => void;
  mentionUsers: TSearchItem[];
  setMentionUsers: (mentionUsers: TSearchItem[]) => void;
  isBottomMentionSuggestionsRender: boolean;
  privateCommunityId: string;
  initialValue?: string;
  resetValue?: boolean;
}

const AmityMentionInput: FC<IMentionInput> = ({
  initialValue = '',
  setInputMessage,
  mentionsPosition,
  setMentionsPosition,
  mentionUsers,
  setMentionUsers,
  isBottomMentionSuggestionsRender,
  privateCommunityId,
  resetValue,
  ...rest
}) => {
  const theme = useTheme() as MyMD3Theme;
  const styles = useStyles();
  const [cursorIndex, setCursorIndex] = useState(0);
  const [currentSearchUserName, setCurrentSearchUserName] = useState('');
  const { searchResult, getNextPage } = useSearch(
    currentSearchUserName,
    privateCommunityId
  );
  const [value, setValue] = useState<string>(initialValue);
  console.log('value: ', value);


  const handleSelectionChange = (event) => {
    setCursorIndex(event.nativeEvent.selection.start);
  };

  const onSelectUserMention = useCallback(
    (user: TSearchItem) => {
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
  useEffect(() => {
    if (resetValue) {
      return onChangeInput('');
    }
    onChangeInput(initialValue);
  }, [initialValue, onChangeInput, resetValue]);

  const renderSuggestions: FC<MentionSuggestionsProps> = useCallback(
    ({ keyword, onSuggestionPress }) => {
      setCurrentSearchUserName(keyword || '');
      if (keyword == null || !searchResult || searchResult?.length === 0) {
        return null;
      }
      return (
        <View style={styles.mentionListContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onEndReached={() => getNextPage && getNextPage()}
            nestedScrollEnabled={true}
            data={searchResult}
            renderItem={({ item }: { item: TSearchItem }) => {
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
    // <MentionTextInput
    //   containerStyle={styles.inputContainer}
    //   style={styles.inputText}
    //   {...rest}
    //   value={value}
    //   onChange={onChangeInput}
    //   onSelectionChange={handleSelectionChange}
    //   partTypes={[
    //     {
    //       isBottomMentionSuggestionsRender,
    //       trigger: '@',
    //       renderSuggestions,
    //       textStyle: styles.mentionText,
    //     },
    //   ]}
    // />
    <View style={styles.inputContainer}>
      <TextInput
       style={styles.textInput} 
       value={value}
        onChangeText={onChangeInput} 
        placeholder='Say something nice...'
        placeholderTextColor={theme.colors.baseShade2}
        />
    </View>

  );
};

export default memo(AmityMentionInput);
