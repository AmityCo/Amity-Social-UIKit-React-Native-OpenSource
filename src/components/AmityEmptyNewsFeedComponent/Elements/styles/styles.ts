import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '../../../../providers/amity-ui-kit-provider';


export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    icon: {
      width: 160,
      height: 160,
    },
    title: {
      fontSize: 17,
      fontWeight: '600',
      color: theme.colors.baseShade3,
      marginVertical: 5,
    },
    description: {
      fontSize: 13,
      fontWeight: '400',
      color: theme.colors.baseShade3,
    },
    exploreBtn: {
      width: '60%',
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
      marginVertical: 17,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    exploreIcon: {
      width: 20,
      height: 20,
    },
    exploreText: {
      color: '#ffffff',
      fontSize: 15,
      marginLeft: 8,
    },
    createCommunityBtnText: {
      color: theme.colors.primary,
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '400',
    },
  });

  return styles;
};
