import { StyleSheet } from 'react-native';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';
import { hexToRgba } from '../../../util/colorUtil';

export const useStyles = (theme: MyMD3Theme) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      marginTop: 8,
      paddingHorizontal: 16,
      paddingTop: 4,
      width: '100%',
    },
    infoIcon: {
      position: 'absolute',
      top: 4,
      right: 4,
    },
    header: {
      gap: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerRightSection: {
      flex: 1,
      marginRight: 12,
    },
    adBadge: {
      flexDirection: 'row',
      gap: 2,
      backgroundColor: hexToRgba(theme.colors.baseShade1, 0.5),
      fontSize: 11,
      borderRadius: 20,
      paddingLeft: 4,
      paddingRight: 6,
      alignItems: 'center',
      alignSelf: 'flex-start',
    },
    adBadgeIcon: {
      width: 16,
      height: 16,
      color: 'white',
    },
    adBadgeContent: {
      color: 'white',
      lineHeight: 18,
    },
    headerText: {
      fontWeight: '600',
      fontSize: 15,
      color: theme.colors.base,
      lineHeight: 20,
    },
    avatar: {
      height: 32,
      width: 32,
      borderRadius: 16,
    },
    textContent: {
      color: theme.colors.base,
      fontSize: 15,
      lineHeight: 20,
      marginVertical: 8,
    },
    image: {
      width: '100%',
      height: 'auto',
      aspectRatio: 1,
      borderRadius: 8,
      marginVertical: 8,
    },
    footer: {
      backgroundColor: theme.colors.backgroundShade1,
      marginHorizontal: -16,
      paddingHorizontal: 11.11,
      paddingVertical: 8.33,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    footerTextWrap: {
      flex: 1,
    },
    footerDescription: {
      fontSize: 11,
      color: theme.colors.baseShade1,
      lineHeight: 18,
    },
    footerHeadline: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.base,
      lineHeight: 18,
    },
    callToActionButton: {
      height: 30,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
    },
    callToActionText: {
      fontSize: 13,
      fontWeight: '600',
      color: 'white',
      lineHeight: 18,
    },
  });

  return styles;
};
