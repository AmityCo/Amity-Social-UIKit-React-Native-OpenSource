import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { getStyles } from './styles';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { ISearchItem } from '../SearchItem';


const InputWithMention = () => {
  
  const theme = useTheme() as MyMD3Theme;
  const styles = getStyles()
  const [inputMessage, setInputMessage] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [mentionNames, setMentionNames] = useState<ISearchItem[]>([])
  const [cursorIndex, setCursorIndex] = useState(0);
  const [currentSearchUserName, setCurrentSearchUserName] = useState<string>()


  const renderTextWithMention = () => {
    const textArr: string[] = inputMessage.split(/(@\w+)(\s*)/).filter(Boolean);

    const textElement = textArr.map((item: string) => {
      const atsIndex = item.indexOf('@')
      const mentionName = atsIndex > -1 ? item.replace(/@/g, '') : '';
      const isTextIncluded = mentionNames.some(item => item.displayName.toLowerCase().includes(mentionName.toLowerCase()));
      return (mentionName !== '' && isTextIncluded) ? <Text style={styles.mentionText}>{item}</Text> : <Text style={styles.inputText}>{item}</Text>
    })
    return <View style={{ flexDirection: 'row' }}>{textElement}</View>
  }

  const handleSelectionChange = (event) => {
    setCursorIndex(event.nativeEvent.selection.start);
  };

  useEffect(() => {
      const substringBeforeCursor = inputMessage.substring(0, cursorIndex)
      const lastAtsIndex = substringBeforeCursor.lastIndexOf('@');
      if(lastAtsIndex!== -1){
        const searchText: string = inputMessage.substring(lastAtsIndex + 1, cursorIndex + 1)
        setCurrentSearchUserName(searchText)
      }

  }, [cursorIndex])
  return (
    <View style={styles.inputContainer}>
    <TextInput
      multiline
      placeholder="What's going on..."
      style={styles.textInput}
      value={inputMessage}
      onChangeText={(text) => setInputMessage(text)}
      placeholderTextColor={theme.colors.baseShade3}
      onSelectionChange={handleSelectionChange}
    />
    <View style={styles.overlay}>
      {renderTextWithMention()}
      {/* <Text style={styles.inputText}>{inputMessage}</Text> */}
    </View>
  </View>
  );
};


export default InputWithMention;