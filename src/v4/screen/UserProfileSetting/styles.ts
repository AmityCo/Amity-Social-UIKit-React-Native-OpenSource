import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.baseShade1,
    },
    iconContainer: {
      width: 28,
      height: 28,
      borderRadius: 4,
      backgroundColor: '#EFEFEF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    icon: {
      width: 18,
      height: 16,
    },
    loadingIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
    },
    arrowIcon: {
      width: 10,
      height: 17,
    },
    rowText: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.base,
    },
    sectionHeader: {
      marginLeft: 16,
      fontSize: 17,
      fontWeight: '600',
      color: theme.colors.base,
    },
  });
  return styles;
};
