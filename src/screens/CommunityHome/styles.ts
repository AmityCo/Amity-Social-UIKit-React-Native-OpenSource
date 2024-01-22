import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const getStyles = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      // alignItems: 'center',
      // justifyContent: 'center',
    },
    joinContainer: {
      flex: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 16,
    },
    joinCommunityButton: {
      // flex: 1,
      // backgroundColor: 'white',
      // borderWidth: 1,
      // borderColor: '#A5A9B5',
      backgroundColor: theme.colors.primary,
      width: '90%',
      padding: 8,
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    joinCommunityText: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: '600',
      color: '#FFF',
    },
    dotIcon: {
      width: 16,
      height: 12,
    },
    imageContainer: {
      width: '100%',
      height: 260,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    darkOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.0)', // Adjust the alpha value for darkness
    },
    overlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      padding: 20,
    },
    overlayCommunityText: {
      color: theme.colors.base,
      fontWeight: 'bold',
      fontSize: 20,
      marginBottom: 5,
      textShadowColor: 'black',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
    joinIcon: {
      width: 18,
      height: 16,
      color: 'white',
    },
    overlayCategoryText: {
      color: theme.colors.base,
      fontWeight: '400',
      fontSize: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      height: 30,
      marginVertical: 10,
      paddingHorizontal: 20,
    },
    rowItem: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    rowItemContent: {
      flexDirection: 'row',
      paddingLeft: 50,
    },
    verticalLine: {
      height: 40,
      width: 1,
      backgroundColor: theme.colors.border,
      marginHorizontal: 5,
    },
    rowNumber: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.base,
    },
    rowLabel: {
      fontSize: 16,
      color: theme.colors.baseShade2,
    },
    textComponent: {
      fontSize: 16,
      paddingTop: 15,
      paddingHorizontal: 20,
      color: theme.colors.base,
    },
    pendingPostWrap: {
      paddingVertical: 16,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 16,
    },
    pendingPostArea: {
      width: '100%',
      height: 62,
      backgroundColor: theme.colors.secondary,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 4,
    },
    pendingText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.base,
      marginLeft: 6,
    },
    pendingDescriptionText: {
      fontSize: 13,
      fontWeight: '400',
      color: theme.colors.baseShade1,
    },
    pendingRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    editProfileButton: {
      width: '98%',
      borderWidth: 1,
      borderColor: '#A5A9B5',
      padding: 8,
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 16,
    },
    editProfileText: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.base,
    },
  });

  return styles;
};
