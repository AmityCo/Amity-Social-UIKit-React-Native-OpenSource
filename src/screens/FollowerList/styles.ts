import { StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const { width } = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: width,
      alignSelf: 'center',
      backgroundColor: theme.colors.background,
      padding: 12,
    },
    listItemContainer: {
      flexDirection: 'row',
      padding: 12,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    userInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 40,
      backgroundColor: theme.colors.baseShade3,
      marginRight: 12,
    },
    defaultAvatar: {
      marginRight: 12,
    },
    userName: {
      color: theme.colors.base,
      fontSize: 15,
      fontWeight: '600',
    },
    menuBtn: {
      paddingLeft: 20,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      minHeight: 720,
      paddingBottom: 40,
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      padding: 16,
      minHeight: 700,
    },
    report: {
      fontSize: 14,
      color: theme.colors.base,
      fontWeight: '600',
      marginBottom: 12,
    },
    remove: {
      fontSize: 14,
      color: theme.colors.alert,
      fontWeight: '600',
      marginBottom: 12,
    },
  });

  return styles;
};
