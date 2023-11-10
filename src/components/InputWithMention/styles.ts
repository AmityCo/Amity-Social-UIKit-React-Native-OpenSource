import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const getStyles =()=>{
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    textInput: {
      borderWidth: 0,
      borderBottomWidth: 0,
      backgroundColor: 'transparent',
      fontSize: 15,
      marginHorizontal: 3,
      color: 'transparent',
      zIndex: 999
      // Additional styles if needed
    },
    inputContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    mentionText: {
      color: theme.colors.primary,
       fontSize: 15,
    },
    inputText: {

      color: theme.colors.base,
      fontSize: 15,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject, // Take up the whole screen
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingHorizontal: 3,
    },
  });
  return styles
}

