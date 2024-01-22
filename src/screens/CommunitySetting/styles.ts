import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const getStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    navBar: {
      height: 60,
      backgroundColor: '#F5F5F5',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#DDDDDD',
    },
    backIcon: {
      width: 25,
      height: 25,
    },
    navBarTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    placeholder: {
      width: 25,
      height: 25,
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#DDDDDD',
    },
    iconContainer: {
      width: 28,
      height: 28,
      borderRadius: 4,
      backgroundColor: '#EFEFEF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    icon: {
      width: 18,
      height: 16,
    },
    groupIcon: {
      width: 20,
      height: 14,
    },
    arrowIcon: {
      width: 10,
      height: 17,
    },
    rowText: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.base,
    },
    leaveChatContainer: {
      alignItems: 'center',
      // paddingVertical: 15,
    },
    leaveChatText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FF0000',
    },
    leaveChatLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: 'red',
    },
  });

  return styles;
};
