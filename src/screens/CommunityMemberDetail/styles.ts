import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    categoryText: { marginLeft: 10, marginBottom: 10, fontSize: 15 },
    LoadingIndicator: {
      paddingVertical: 20,
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginBottom: 10,
      backgroundColor: '#D9E5FC',
    },
    dotIcon: {
      width: 16,
      height: 12,
    },
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
    modalRow: {
      marginVertical: 10,
    },
    postText: {
      paddingLeft: 12,
      fontWeight: '600',
      color: theme.colors.base,
      fontSize: 16,
    },
    plusIcon:{
      marginRight: 8
    }
  });

  return styles;
};
