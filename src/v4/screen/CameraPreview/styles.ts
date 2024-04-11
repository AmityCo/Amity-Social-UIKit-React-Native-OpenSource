import { StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const { width } = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.colors.background,
    },
    backBtn: {
      position: 'absolute',
      top: Platform.select({ ios: 56, android: 28 }),
      left: 24,
    },
    aspectRatioBtn: {
      position: 'absolute',
      top: Platform.select({ ios: 56, android: 28 }),
      right: 24,
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
      height: (width * 16) / 9,
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
  });

  return styles;
};
