import { StyleSheet } from 'react-native';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const useStyle = (themeStyle: MyMD3Theme) => {
  const styles = StyleSheet.create({
    feedWrap: {
      backgroundColor: themeStyle.colors.baseShade4,
      height: '100%',
      paddingBottom: 50,
    },
  });
  return styles;
};
