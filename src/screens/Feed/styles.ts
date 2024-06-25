import { Dimensions, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;



  const styles = StyleSheet.create({
    feedWrap: {
      backgroundColor: theme.colors.baseShade4,
      flex: 1,
      height: '100%',
      minHeight: Dimensions.get('window').height-200


    },
  });

  return styles;
};
