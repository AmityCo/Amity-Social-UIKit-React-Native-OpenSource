import { Platform, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: Platform.OS === 'android' ? 35 : 10, // Adjust for Android status bar
    },
    header: {
      paddingTop: Platform.OS === 'ios' ? 50 : 20, // Adjust for iOS notch
      zIndex: 1,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      left: 10,
      bottom: 8,
      zIndex: 1,
      padding: 10,
    },
    headerTextContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      fontWeight: '600',
      fontSize: 17,
      textAlign: 'center',
      color: theme.colors.base,
    },
    communityText: {
      marginLeft: 12,
      marginBottom: 10,
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.base,
    },
    myCommunityText: {
      color: theme.colors.base,
      padding: 16,
      opacity: 0.4,
      fontSize: 17,
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    rowContainerMyTimeLine: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 16,
      paddingTop: 26,
      paddingHorizontal: 16,
      borderBottomColor: theme.colors.baseShade4,
      borderBottomWidth: 1,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginBottom: 10,
      backgroundColor: '#D9E5FC',
      marginRight: 12
    },
    LoadingIndicator: {
      paddingVertical: 20,
    },
  });
  return styles;
};
