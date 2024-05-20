import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const useStyle = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    sectionHeader: {
      backgroundColor: theme.colors.baseShade4,
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    sectionHeaderText: {
      fontWeight: '600',
      fontSize: 15,
      color: '#898E9E',
    },
  });
  return styles;
};
