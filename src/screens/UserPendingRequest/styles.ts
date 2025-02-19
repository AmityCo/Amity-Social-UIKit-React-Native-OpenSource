import { StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const { width } = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      width: width,
      alignSelf: 'center',
      backgroundColor: theme.colors.background,
      padding: 12,
      paddingVertical: 24,
      borderBottomWidth: 5,
      borderBottomColor: theme.colors.baseShade4,
    },
    header: {
      flexDirection: 'row',
      marginBottom: 8,
      alignItems: 'center',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 40,
      marginRight: 12,
    },
    displayName: {
      color: theme.colors.base,
      fontSize: 15,
      fontWeight: '600',
    },
    actionContainer: {
      flexDirection: 'row',
      marginTop: 8,
      alignItems: 'center',
    },
    accept: {
      flex: 1,
      margin: 4,
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },
    decline: {
      flex: 1,
      margin: 4,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.baseShade3,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },
    acceptText: {
      color: theme.colors.background,
      fontSize: 15,
      fontWeight: '600',
    },
    declineText: {
      color: theme.colors.base,
      fontSize: 15,
      fontWeight: '600',
    },
  });

  return styles;
};
