import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    barContainer: {
      backgroundColor: theme.colors.background,
      borderBottomColor: theme.colors.baseShade4,
      borderBottomWidth: 1,
    },
    header: {
      zIndex: 1,
      padding: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    closeButton: {
      padding: 10,
      zIndex: 1,
      left: 4,
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
    postText: {
      fontWeight: '400',
      fontSize: 15,
      textAlign: 'center',
      color: theme.colors.primary,
    },
    disabled: {
      opacity: 0.3,
      color: theme.colors.primary,
    },
    AllInputWrap: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    inputTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: theme.colors.base,
    },
    requiredField: {
      color: 'red',
    },
    maxPollQuestionText: {
      color: theme.colors.base,
    },
    inputContainer: {
      margin: 16,
      borderBottomColor: theme.colors.baseShade4,
      borderBottomWidth: 1,
      paddingBottom: 20,
    },
    mentionInputContainer: {
      marginTop: 15,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    input: {
      marginTop: 12,
      width: '100%',
      color: theme.colors.base,
    },
    errorText: {
      color: theme.colors.error,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.baseShade3,
      marginTop: 4,
      marginBottom: 12,
    },
    addOptionBtn: {
      borderRadius: 5,
      borderColor: theme.colors.baseShade3,
      borderWidth: 1,
      width: '100%',
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
      flexDirection: 'row',
    },
    addOptionText: {
      color: theme.colors.base,
      fontSize: 14,
      fontWeight: 'bold',
    },
    fillSpace: {
      flex: 1,
    },
    optionInput: {
      flex: 1,
      padding: 5,
      fontSize: 15,
      color: theme.colors.base,
    },
    scrollContainer: {
      paddingVertical: 16,
    },
    pollOptionContainer: {
      borderRadius: 5,
      backgroundColor: theme.colors.baseShade4,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginVertical: 5,
    },
    scheduleOptionContainer: {
      maxHeight: 200,
      backgroundColor: theme.colors.background,
    },
    scheduleOptionText: {
      color: theme.colors.base,
    },
    scheduleSelectorSelectStyle: {
      alignItems: 'flex-start',
      marginTop: 16,
      borderWidth: 0,
    },
    selectedTimeFrame: {
      color: theme.colors.base,
    },
    scheduleTitleStyle: {
      fontWeight: 'bold',
      fontSize: 18,
      alignSelf: 'flex-start',
      marginBottom: 20,
      color: theme.colors.base,
    },
    scheduleInitValueTextStyle: {
      color: theme.colors.base,
    },
    scheduleOptionStyle: {
      borderBottomWidth: 0,
      marginVertical: 5,
      backgroundColor: theme.colors.baseShade4,
      borderRadius: 2,
    },
    scheduleSectionStyle: {
      borderBottomWidth: 0,
    },
    scheduleSelectedItemText: {
      color: theme.colors.primary,
    },
    optionWordCount: {
      alignSelf: 'flex-end',
      color: theme.colors.baseShade3,
      fontSize: 12,
    },
  });

  return styles;
};
