import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const getStyles=()=>{
  const theme = useTheme() as MyMD3Theme ;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    input: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 20,
      fontWeight: '400',
      width: '90%',
      paddingHorizontal: 16,
      paddingVertical: 10,
      color: theme.colors.base,
    },
    AllInputWrap: {
      backgroundColor: theme.colors.screenBackground,
      flex: 1,
    },
    InputWrap: {
      backgroundColor: theme.colors.background,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingBottom: 25,
      paddingTop: 20,
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    postDisabledBtn: {
      color: '#A0BDF8',
      fontSize: 16,
    },
    postBtn: {
      color: theme.colors.primary,
      fontSize: 16,
    },
    commentItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    comment: {
      fontSize: 14,
    },
    commentListWrap: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
  });
  
  return styles;
}
