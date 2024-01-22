import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const getStyles = () => {
  const theme = useTheme() as MyMD3Theme;

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      padding: 20,
      minHeight: 120,
    },
    scrollContentContainer: {
      flexGrow: 1,
      justifyContent: 'flex-end',
    },
    modalText: {
      fontSize: 18,
      marginBottom: 10,
      textAlign: 'center',
    },
    closeButton: {
      backgroundColor: '#007AFF',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginTop: 10,
    },
    modalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
    },
    closeButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    postText: {
      paddingLeft: 12,
      fontWeight: '600',
      color: theme.colors.base,
    },
    invisible: {
      display: 'none',
    },
    visible: {
      display: 'flex',
    },
    btnWrap: {
      padding: 5,
    },
  });

  return styles;
};
