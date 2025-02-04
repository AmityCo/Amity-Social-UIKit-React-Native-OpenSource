import { StyleSheet } from 'react-native';
import type { MyMD3Theme } from './../../providers/amity-ui-kit-provider';

export const useStyles = (theme: MyMD3Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 16,
      borderTopWidth: 8,
      borderColor: theme.colors.baseShade4,
    },
    communityItemContainer: {
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.baseShade4,
    },
    communityInfoContainer: {
      flex: 1,
      paddingLeft: 24,
    },
    communityNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    communityName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.base,
      
    },
    privateBadge: {
      width: 24,
      height: 24,
      tintColor: theme.colors.base,
    },
    officialBadge: {
      width: 24,
      height: 24,
      marginLeft: 4,
    },
    communityCategoryContainer: {
      flexDirection: 'row',
      marginVertical: 4,
      flex: 1,
    },
    categoryName: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: theme.colors.baseShade4,
      color: theme.colors.base,
      borderRadius: 12,
      overflow: 'hidden',
      marginHorizontal: 2,
      fontSize: 12,
      maxWidth: '30%',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 64,
    },
    communityCount: {
      color: theme.colors.baseShade1,
      fontSize: 12,
    },
    skeletonLoadingContainer: {
      borderBottomWidth: 2,
      borderColor: theme.colors.baseShade4,
      paddingVertical: 8,
    },
  });

  return styles;
};
