import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
const CAMERA_ICON_SIZE = 30;

export const getStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      // justifyContent: 'center',
      paddingHorizontal: 16,
      backgroundColor: theme.colors.background,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: 20,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
    },
    overlay: {
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    cameraIconContainer: {
      position: 'absolute',
      bottom: -8,
      right: -5,
    },
    cameraIcon: {
      backgroundColor: '#EBECEF',
      borderRadius: CAMERA_ICON_SIZE / 2,
      padding: 5,
      margin: 5,
    },
    imageIcon: {},
    displayNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 10,
    },
    displayNameText: {
      flex: 1,
      fontWeight: '600',
      fontSize: 17,
    },
    characterCountContainer: {
      marginRight: 10,
    },
    characterCountText: {
      fontSize: 14,
      color: 'gray',
    },
    input: {
      width: '100%',
      height: 50,
      padding: 10,
      borderBottomWidth: 1,
      borderRadius: 5,
      borderColor: '#EBECEF',
      fontSize: 16,
    },
  });

  return styles;
};
