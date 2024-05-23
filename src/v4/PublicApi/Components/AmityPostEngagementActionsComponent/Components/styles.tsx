import { StyleSheet } from 'react-native';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const useStyles = (theme: MyMD3Theme) => {
  const styles = StyleSheet.create({
    feedActionSection: {
      borderTopColor: theme.colors.baseShade4,
      borderTopWidth: 1,
      flexDirection: 'row',
      marginTop: 8,
      marginBottom: 4,
      paddingVertical: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    actionSection: {
      borderTopColor: theme.colors.baseShade4,
      borderTopWidth: 1,
      flexDirection: 'row',
      marginTop: 8,
      marginBottom: 4,
      paddingVertical: 8,
      alignItems: 'center',
    },
    btnText: {
      color: theme.colors.baseShade2,
      fontSize: 15,
      fontWeight: '600',
      marginHorizontal: 4,
    },
    likeBtn: {
      flexDirection: 'row',
      paddingRight: 6,
      alignItems: 'center',
    },
    commentBtn: {
      flexDirection: 'row',
      paddingHorizontal: 10,
      alignItems: 'center',
    },
    likedText: {
      color: theme.colors.primary,
      fontSize: 15,
      fontWeight: '600',
      marginHorizontal: 4,
    },
    countSection: {
      marginVertical: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    likeCountText: {
      fontSize: 13,
      color: theme.colors.baseShade2,
    },
    commentCountText: {
      fontSize: 13,
      color: theme.colors.baseShade2,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
  return styles;
};
