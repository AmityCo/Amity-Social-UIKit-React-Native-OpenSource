import { StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const { height } = useWindowDimensions();
  const styles = StyleSheet.create({
    image: {
      width: '100%',
      height: height * 0.2,
      alignSelf: 'center',
      backgroundColor: theme.colors.baseShade4,
    },
    metadataContainer: {
      marginTop: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.baseShade4,
      overflow: 'hidden',
    },
    metadataTextContainer: {
      padding: 12,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 15,
      color: theme.colors.base,
    },
    shortUrl: {
      fontSize: 13,
      color: theme.colors.baseShade1,
      marginBottom: 4,
    },
  });

  return styles;
};
