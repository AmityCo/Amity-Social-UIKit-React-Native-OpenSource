import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;

  const styles = StyleSheet.create({
    mentionListContainer: {
      marginTop: 10,
      width: '100%',
      maxHeight: 150,
      top: 0,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.baseShade4,
      borderRadius: 5,
    },
    mentionContainer: {
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 30,
      height: 30,
      marginRight: 10,
    },
    mentionUserName: {
      fontSize: 14,
      color: theme.colors.base,
    },
    mentionText: {
      color: theme.colors.primary,
      fontSize: 15,
    },
    inputContainer: {
      width: '100%',
    },
    inputText: {
      color: theme.colors.base,
      fontSize: 15,
      padding: 0,
      maxHeight: 200,
    },
    textInput: {
      marginTop: 12,
      fontSize: 15,
      width: '100%',
    },
    transparentText: {
      color: 'transparent',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingHorizontal: 6,
    },
  });

  return styles;
};
