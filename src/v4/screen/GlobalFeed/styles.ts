import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const useStyle = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    feedWrap: {
      backgroundColor: theme.colors.baseShade4,
      height: '100%',
      paddingBottom: 50,
    },
  });
  return styles;
};
