import { StyleSheet, useWindowDimensions } from 'react-native';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = (theme: MyMD3Theme) => {
  const { top, bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      top: top,
      width: '100%',
      position: 'absolute',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.baseShade4,
    },
    headerIcon: {
      width: 18,
      height: 18,
      tintColor: theme.colors.base,
      resizeMode: 'contain',
    },
    headerTitle: {
      fontSize: 17,
      color: theme.colors.base,
      fontWeight: '600',
    },
    scrollContainer: {
      flex: 1,
    },
    input: {
      backgroundColor: theme.colors.baseShade4,
      borderRadius: 20,
      fontWeight: '400',
      width: '90%',
      paddingHorizontal: 16,
      paddingVertical: 10,
      color: theme.colors.base,
    },
    AllInputWrap: {
      backgroundColor: theme.colors.baseShade4,
      flex: 1,
      marginTop: -16,
    },
    InputWrap: {
      backgroundColor: theme.colors.background,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingBottom: 25,
      paddingTop: 10,
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.colors.baseShade4,
    },
    myAvatar: {
      width: 32,
      height: 32,
      borderRadius: 32,
      alignSelf: 'center',
      marginRight: 8,
    },
    postDisabledBtn: {
      color: '#A0BDF8',
      fontSize: 16,
    },
    postBtnText: {
      color: theme.colors.primary,
      fontSize: 16,
    },
    postBtn: {
      marginHorizontal: 12,
    },
    commentItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.baseShade4,
    },
    comment: {
      fontSize: 14,
    },
    commentListWrap: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.baseShade4,
    },
    textInput: {
      borderWidth: 0,
      borderBottomWidth: 0,
      backgroundColor: 'transparent',
      fontSize: 15,
      marginHorizontal: 3,
      zIndex: 999,
      paddingTop: 0,
      width: '100%',
      borderRadius: 20,

      // Additional styles if needed
    },
    transparentText: {
      color: 'transparent',
    },
    inputContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.baseShade4,
      borderRadius: 20,
    },
    mentionText: {
      color: theme.colors.primary,
      fontSize: 15,
    },
    inputText: {
      color: theme.colors.base,
      fontSize: 15,
      letterSpacing: 0,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject, // Take up the whole screen
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingHorizontal: 12,
    },
    inputTextOverlayWrap: {
      flexDirection: 'row',
      backgroundColor: theme.colors.baseShade4,
    },
    replyLabelWrap: {
      height: 40,
      backgroundColor: theme.colors.baseShade4,
      paddingVertical: 10,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    replyLabel: {
      color: theme.colors.baseShade1,
      fontSize: 15,
      paddingLeft: 16,
      paddingRight: 12,
    },
    closeIcon: {
      marginRight: 12,
    },
    userNameLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.baseShade1,
    },
    commentListFooter: {
      width: width,
      position: 'absolute',
      bottom: bottom,
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
      padding: 10,
      minHeight: 700,
    },
    twoOptions: {
      minHeight: 750,
    },
    modalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
      marginVertical: 8,
    },
    handleBar: {
      alignSelf: 'center',
      width: 36,
      backgroundColor: theme.colors.baseShade4,
      height: 5,
      marginVertical: 10,
      borderRadius: 10,
    },
    deleteText: {
      paddingLeft: 12,
      fontWeight: '600',
      color: theme.colors.base,
    },
  });

  return styles;
};
