import { StyleSheet } from 'react-native';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
export const useStyles = (theme: MyMD3Theme) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flexDirection: 'row',
      paddingHorizontal: 16,
      alignItems: 'center',
      marginVertical: 8,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 64,
    },
    profileInfoContainer: {
      marginLeft: 16,
      justifyContent: 'center',
    },
    category: {
      marginVertical: 2,
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: theme.colors.baseShade4,
      color: theme.colors.base,
      borderRadius: 12,
      overflow: 'hidden',
      marginHorizontal: 2,
      fontSize: 12,
    },
    memberCounts: {
      fontSize: 13,
      fontWeight: '400',
      color: theme.colors.baseShade1,
      marginVertical: 2,
    },
    rowContainer: {
      justifyContent: 'center',
      flexDirection: 'row',
    },
    diaplayName: {
      fontWeight: '600',
      fontSize: 15,
      color: theme.colors.base,
    },
    lockIcon: {
      width: 20,
      height: 20,
      tintColor: theme.colors.base,
    },
    badgeIcon: {
      width: 20,
      height: 20,
    },
  });

  return styles;
};
