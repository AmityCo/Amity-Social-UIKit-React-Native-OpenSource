import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';


const InputComponent = () => {
  const [inputText, setInputText] = useState('');

  const handleTextChange = (text) => {
    setInputText(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={handleTextChange}
        placeholder="Type something..."
      />
     <Text>{inputText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default InputComponent;