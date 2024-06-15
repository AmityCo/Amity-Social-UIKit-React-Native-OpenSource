import { StyleSheet } from 'react-native';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const useStyle = (themeStyle: MyMD3Theme) => {
  const styles = StyleSheet.create({
    feedWrap: {
      backgroundColor: themeStyle.colors.baseShade4,
      height: '100%',
    },
  });
  return styles;
};
