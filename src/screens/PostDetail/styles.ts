import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const getStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    input: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 20,
      fontWeight: '400',
      width: '90%',
      paddingHorizontal: 16,
      paddingVertical: 10,
      color: theme.colors.base,
    },
    AllInputWrap: {
      backgroundColor: theme.colors.screenBackground,
      flex: 1,
    },
    InputWrap: {
      backgroundColor: theme.colors.background,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingBottom: 25,
      paddingTop: 10,
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    postDisabledBtn: {
      color: '#A0BDF8',
      fontSize: 16,
    },
    postBtnText: {
      color: theme.colors.primary,
      fontSize: 16,
    },
    postBtn: {
      marginHorizontal: 12,
    },
    commentItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    comment: {
      fontSize: 14,
    },
    commentListWrap: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    textInput: {
      borderWidth: 0,
      borderBottomWidth: 0,
      backgroundColor: 'transparent',
      fontSize: 15,
      marginHorizontal: 3,
      zIndex: 999,
      paddingTop: 0,
      width: '100%',
      borderRadius: 20,

      // Additional styles if needed
    },
    transparentText: {
      color: 'transparent',
    },
    inputContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.secondary,
      borderRadius: 20,
    },
    mentionText: {
      color: theme.colors.primary,
      fontSize: 15,
    },
    inputText: {
      color: theme.colors.base,
      fontSize: 15,
      letterSpacing: 0,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject, // Take up the whole screen
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingHorizontal: 12,
    },
    inputTextOverlayWrap: {
      flexDirection: 'row',
      backgroundColor: theme.colors.secondary,
    },
  });

  return styles;
};
