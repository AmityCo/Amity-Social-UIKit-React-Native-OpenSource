import { StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '../../../providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const { width } = useWindowDimensions();
  const styles = StyleSheet.create({
    mentionListContainer: {
      marginTop: 10,
      width: width,
      maxHeight: 170,
      top: 0,
      backgroundColor: 'transparent',
    },
    avatar: {
      width: 30,
      height: 30,
      marginRight: 10,
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
      maxHeight: 100,
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
