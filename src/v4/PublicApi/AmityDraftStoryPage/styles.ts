import { StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const { width, height } = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.colors.base,
    },
    backBtn: {
      position: 'absolute',
      top: Platform.select({ ios: 56, android: 28 }),
      left: 24,
    },
    aspectRatioBtn: {
      position: 'absolute',
      top: Platform.select({ ios: 56, android: 28 }),
      right: 72,
    },
    aspectRationIcon: {
      width: 32,
      height: 32,
    },
    avatar: {
      width: 35,
      height: 35,
      borderRadius: 50,
    },
    imageContainer: {
      maxHeight: height * 0.8,
      height: width * (16 / 9),
      width: width,
      borderRadius: 20,
      backgroundColor: theme.colors.baseShade4,
      justifyContent: 'center',
      overflow: 'hidden',
    },
    aspect_ratio: {
      width: '100%',
      height: '100%',
    },
    image: {
      width: '100%',
      height: '60%',
    },
    shareStoryBtn: {
      marginTop: 16,
      marginRight: 8,
      alignSelf: 'flex-end',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 5,
      paddingVertical: 5,
      borderRadius: 50,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.base,
      borderWidth: 1,
    },
    shareStoryTxt: {
      color: theme.colors.base,
      fontSize: 14,
      marginHorizontal: 8,
    },
    bottomSheet: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: theme.colors.background,
      width: width,
      height: 0.9 * height,
    },
    hyperLinkBtn: {
      position: 'absolute',
      top: Platform.select({ ios: 56, android: 28 }),
      right: 24,
    },
    hyperlinkContainer: {
      backgroundColor: theme.colors.baseShade3,
      borderRadius: 50,
      paddingHorizontal: 24,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      position: 'absolute',
      bottom: '20%',
    },
    hyperlinkText: {
      marginLeft: 8,
      fontSize: 14,
      color: theme.colors.base,
    },
    hyperLinkIcon: {
      width: 32,
      height: 32,
    },
    handleBar: {
      width: 0.15 * width,
      backgroundColor: theme.colors.baseShade4,
      height: 5,
      marginVertical: 10,
      borderRadius: 10,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginTop: 12,
    },
    flexContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.base,
      textAlign: 'center',
    },
    done: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.baseShade2,
      textAlign: 'right',
    },
    activeDone: {
      color: theme.colors.primary,
    },
    horizontalSperator: {
      width: '100%',
      backgroundColor: theme.colors.baseShade4,
      height: 2,
      marginVertical: 10,
    },
    commentBottomSheet: {
      alignItems: 'center',
      height: '100%',
    },
    inputContainer: {
      width: '85%',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.base,
      paddingVertical: 12,
    },
    rowContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textCount: {
      marginVertical: 24,
      color: theme.colors.baseShade1,
    },
    label: {
      fontSize: 16,
      color: theme.colors.base,
      marginVertical: 24,
      alignSelf: 'flex-start',
      fontWeight: 'bold',
    },
    requiredSign: {
      color: theme.colors.alert,
    },
    input: {
      padding: 0,
      width: '100%',
      fontSize: 14,
      color: theme.colors.base,
    },
    note: {
      color: theme.colors.baseShade1,
      alignSelf: 'flex-start',
      marginLeft: 28,
      marginTop: 8,
    },
    inValidUrl: {
      color: theme.colors.alert,
      alignSelf: 'flex-start',
      marginLeft: 28,
      marginTop: 8,
    },
    removeLink: {
      color: theme.colors.alert,
      fontSize: 14,
      marginLeft: 8,
    },
    deleteHyperlinkContainer: {
      flexDirection: 'row',
      marginTop: 28,
      alignItems: 'center',
    },
    alertBorderColor: {
      borderBlockColor: theme.colors.alert,
    },
  });

  return styles;
};
