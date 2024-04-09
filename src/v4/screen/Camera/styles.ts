import { StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const { width } = useWindowDimensions();
  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: '#000',
    },
    cameraContainer: {
      width: '100%',
      flex: 1,
      borderRadius: 20,
    },
    camera: {
      width: '100%',
      height: '100%',
      borderRadius: 20,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingBottom: 10,
      position: 'absolute',
    },
    timer: {
      position: 'absolute',
      alignSelf: 'center',
      top: 24,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    timerTxt: {
      color: theme.colors.background,
      fontSize: 14,
    },
    backBtn: {
      position: 'absolute',
      top: 24,
      left: 24,
      padding: 8,
      borderRadius: 50,
      backgroundColor: theme.colors.backdrop,
    },
    flashIcon: {
      position: 'absolute',
      top: 24,
      right: 24,
    },
    switchCamera: {
      position: 'absolute',
      bottom: 24,
      right: 24,
    },
    gallery: {
      position: 'absolute',
      bottom: 24,
      left: 24,
    },
    cameraCaptureBtn: {
      borderRadius: 100,
      width: 72,
      height: 72,
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: 'white',
      padding: 5,
      alignSelf: 'center',
      bottom: 10,
      position: 'absolute',
    },
    cameraCaptureBtnFill: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: 100,
    },
    videoCaptureBtn: {
      borderRadius: 100,
      width: 72,
      height: 72,
      padding: 5,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      bottom: 10,
      position: 'absolute',
    },
    videoCaptureInnerButton: {
      width: 42,
      height: 42,
      padding: 5,
      backgroundColor: theme.colors.error,
      justifyContent: 'center',
      alignItems: 'center',
    },
    switchContainer: {
      marginVertical: 20,
      alignSelf: 'center',
      width: width * 0.6,
      backgroundColor: theme.colors.base,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    switch: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    switchTxt: {
      color: theme.colors.baseShade2,
    },
  });

  return styles;
};
