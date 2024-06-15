import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 50,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.baseShade4,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.baseShade4,
    },
    tabText: {
      fontSize: 17,
      fontWeight: 'bold',
      color: theme.colors.base,
      marginHorizontal: 15,
      textAlign: 'center',
    },
    activeTabText: {
      color: theme.colors.primary,
    },
    indicator: {
      position: 'absolute',
      bottom: 0,
      height: 2,
      backgroundColor: theme.colors.primary,
    },
  });
  return styles;
};
