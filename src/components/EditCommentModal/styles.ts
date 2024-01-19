import { Platform, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const getStyles = () => {
  const theme = useTheme() as MyMD3Theme;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: Platform.OS === 'android' ? 35 : 10, // Adjust for Android status bar
      paddingHorizontal: 15,
    },
    header: {
      paddingTop: Platform.OS === 'ios' ? 50 : 20, // Adjust for iOS notch
      zIndex: 1,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    closeButton: {
      zIndex: 1,
      padding: 10,
    },
    headerTextContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      fontWeight: '600',
      fontSize: 17,
      textAlign: 'center',
      color: theme.colors.base,
    },

    textInput: {
      borderWidth: 0,
      borderBottomWidth: 0,
      backgroundColor: 'transparent',
      fontSize: 15,
      marginHorizontal: 3,
      color: theme.colors.base,
    },

    AllInputWrap: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    InputWrap: {
      backgroundColor: theme.colors.background,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 15,
      paddingBottom: 35,
      paddingTop: 15,
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
  });
  return styles;
};
