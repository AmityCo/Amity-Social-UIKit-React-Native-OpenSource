import { StyleSheet } from 'react-native';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const useStyles = (theme: MyMD3Theme) => {
  const styles = StyleSheet.create({
    container: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: theme.colors.background,
      width: '100%',
    },
    header: {
      fontSize: 17,
      lineHeight: 22,
      textAlign: 'center',
      color: theme.colors.base,
      fontWeight: '600',
      paddingVertical: 13,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.baseShade4,
    },
    content: {
      paddingHorizontal: 16,
    },
    contentItem: {
      marginTop: 24,
      marginBottom: 8,
    },
    contentTitle: {
      fontWeight: '600',
      fontSize: 15,
      lineHeight: 20,
      color: theme.colors.base,
      marginBottom: 8,
    },
    contentDetail: {
      flexDirection: 'row',
      padding: 8,
      gap: 8,
      backgroundColor: theme.colors.baseShade4,
      borderRadius: 8,
    },
    infoIcon: {
      width: 16,
      height: 16,
      color: theme.colors.baseShade1,
    },
    contentDetailText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.baseShade1,
    },
  });

  return styles;
};
