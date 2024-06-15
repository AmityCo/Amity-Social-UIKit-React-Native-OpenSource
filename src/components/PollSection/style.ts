import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 10,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
    },
    pollEndDays: {
      fontWeight: '700',
      color: theme.colors.base,
    },
    totalVote: {
      fontSize: 12,
      color: theme.colors.baseShade3,
    },
    voteCount: {
      color: theme.colors.baseShade1
    },
    pollOptionContainer: {
      borderWidth: 1,
      borderColor: theme.colors.baseShade4,
      borderRadius: 5,
      padding: 10,
      marginVertical: 5,
    },
    pollOptionContainerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    optionText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.base,
      marginLeft: 16,
      fontWeight: '500',
    },
    submitBtn: {
      marginTop: 16,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    submit: {
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    moreOptionsBtn: {
      marginTop: 16,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.baseShade3,
      borderRadius: 3,
      paddingVertical: 10,
    },
    selectedOptionContainer: {
      borderColor: theme.colors.primary,
    },
    backgroundBar: {
      width: '100%',
      height: 10,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      marginTop: 10,
    },
    innerBar: {
      backgroundColor: theme.colors.baseShade1,
      flex: 1,
      borderRadius: 20,
    },
    myVoteBar: {
      backgroundColor: theme.colors.primary,
    },
    onResultOption: {
      borderLeftWidth: 5,
      borderColor: theme.colors.primary,
    },
  });
  return styles;
};
