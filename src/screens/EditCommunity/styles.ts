import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    container: {
      paddingBottom: 320,
      backgroundColor: theme.colors.screenBackground,
    },
    uploadContainer: {
      width: '100%',
      height: '35%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
    },
    defaultImage: {
      width: '100%',
      height: '100%',
      backgroundColor: '#898e9e',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    button: {
      position: 'absolute',
      backgroundColor: 'transparent',
      borderColor: 'white',
      borderWidth: 1,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    btnWrap: {
      padding: 10,
    },
    allInputContainer: {
      paddingVertical: 24,
      backgroundColor: theme.colors.background,
    },
    inputContainer: {
      paddingHorizontal: 16,
      justifyContent: 'center',
      marginBottom: 24,
    },

    inputTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: theme.colors.base,
    },
    requiredField: {
      color: 'red',
    },
    inputField: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      borderRadius: 5,
      marginTop: 5,
      paddingVertical: 16,
      color: theme.colors.base,
    },
    inputLengthMeasure: {
      alignSelf: 'flex-end',
      marginTop: 5,
      color: 'grey',
    },
    placeHolderText: {
      color: '#A5A9B5',
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    categoryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    addIcon: {
      marginHorizontal: 6,
    },
    arrowIcon: {
      opacity: 0.75,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 24,
      paddingHorizontal: 16,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 72,
      marginRight: 12,
      backgroundColor: '#EBECEF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.base,
    },
    dotIcon: {
      width: 16,
      height: 12,
    },
    categoryText: {
      fontSize: 13,
      color: theme.colors.baseShade1,
      marginTop: 4,
    },
    optionDescription: {
      width: '70%',
    },
    radioGroup: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginBottom: 24,
    },
    createButton: {
      flexDirection: 'row',
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      marginHorizontal: 16,
      borderRadius: 4,
      marginBottom: 24,
    },
    createText: {
      fontWeight: '600',
      fontSize: 15,
      color: '#FFFFFF',
    },
    addUsersContainer: {
      marginVertical: 6,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingBottom: 24,
    },
    userItemWrap: {
      flexDirection: 'row',
      backgroundColor: '#EBECEF',
      borderRadius: 24,
      padding: 6,
      height: 40,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: 6,
      maxWidth: '45%',
    },
    avatarImageContainer: {
      overflow: 'hidden',
      borderRadius: 40,
      width: 30,
      height: 30,
      marginRight: 5,
    },
    avatarImage: {
      width: 30,
      height: 30,
    },
    avatarRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    loading: {
      marginLeft: 6,
    },
    saveText: {
      color: theme.colors.primary,
    },
    errorText: {
      color: theme.colors.error,
    },
  });

  return styles;
};
