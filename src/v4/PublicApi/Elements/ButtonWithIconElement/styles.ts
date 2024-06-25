import { StyleSheet } from 'react-native';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const useStyle = (themeStyle: MyMD3Theme) => {
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      width: 200,
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 16,
      gap: 8,
    },
    icon: {
      width: 20,
      height: 20,
      tintColor: themeStyle.colors.base,
    },
    label: {
      color: themeStyle.colors.base,
      fontWeight: '600',
      fontSize: 15,
      lineHeight: 20,
    },
  });
  return styles;
};
