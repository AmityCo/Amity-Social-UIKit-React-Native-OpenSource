import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const getStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.screenBackground,
    },
    categoryText: {
      marginLeft: 10,
      marginBottom: 10,
      fontSize: 15,
      color: theme.colors.base,
    },
    LoadingIndicator: {
      paddingVertical: 20,
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginBottom: 10,
      backgroundColor: '#D9E5FC',
    },
    declineWarningText: {
      color: theme.colors.baseShade1,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
  });

  return styles;
};
