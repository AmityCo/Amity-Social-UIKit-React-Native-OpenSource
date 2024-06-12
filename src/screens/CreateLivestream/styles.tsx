import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    container: {
      height: '100%',
      backgroundColor: '#000000',
    },
    cameraContainer: {
      marginTop: '15%',
      height: '80%',
    },
    livestreamView: {
      flex: 1,
    },
    endingStreamWrap: {
      flex: 1,
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    endingStreamText: {
      color: '#FFFFFF',
    },
    streamingWrap: {
      flex: 1,
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    streamingTimerWrap: {
      alignSelf: 'center',
      backgroundColor: '#FF305A',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 20,
      left: 16,
    },
    streamingTimer: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '600',
      lineHeight: 18,
    },
    idleWrap: {
      flex: 1,
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    idleWraplInner: {
      padding: 16,
    },
    optionTopWrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
    },
    optionTopRightWrap: {
      flexDirection: 'row',
      gap: 10,
    },
    optionIcon: {
      flexDirection: 'row',
      borderRadius: 50,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      minWidth: 32,
      height: 32,
    },
    optionIconInner: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    thumbnailImage: {
      width: 56,
      height: 32,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.base,
    },
    postTarget: {
      marginTop: 36,
      flexDirection: 'row',
      alignItems: 'center',
      color: 'whites',
      gap: 6,
    },
    avatar: {
      width: 28,
      height: 28,
    },
    targetName: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '600',
      lineHeight: 20,
    },
    seperator: {
      width: '100%',
      height: 1,
      backgroundColor: theme.colors.baseShade3,
      marginTop: 16,
    },
    detailWrap: {
      marginTop: 28,
    },
    title: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      height: 40,
      padding: 0,
    },
    description: {
      color: '#FFF',
      fontSize: 14,
      height: 40,
      padding: 0,
    },
    footer: {
      height: '10%',
    },
    streamingFooter: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    finishButton: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.baseShade3,
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      width: 75,
      height: 40,
    },
    finishButtonText: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '600',
      color: theme.colors.base,
    },
    goLiveButton: {
      marginTop: 15,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.baseShade3,
      borderRadius: 4,
      height: 40,
      width: '90%',
      marginHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    goLiveButtonText: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '600',
      color: theme.colors.base,
    },
    bottomSheetWrap: {
      marginTop: 16,
    },
    bottomSheetButton: {
      padding: 16,
    },
    bottomSheetButtonNormalText: {
      color: theme.colors.secondary,
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 20,
    },
    bottomSheetButtonDeleteText: {
      color: theme.colors.alert,
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 20,
    },
  });

  return styles;
};
