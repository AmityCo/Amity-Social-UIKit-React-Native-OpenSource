import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../../providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    commentWrap: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: 12,
      width: '100%',
      alignSelf: 'center',
    },
    replyCommentWrap: {
      backgroundColor: theme.colors.background,
      width: '100%',
      paddingTop: 4,
    },
    headerSection: {
      paddingVertical: 12,
      flexDirection: 'row',
    },
    replyHeaderSection: {
      paddingTop: 8,
      flexDirection: 'row',
    },
    headerText: {
      fontWeight: '600',
      fontSize: 15,
      color: theme.colors.base,
      marginBottom: 4,
    },
    headerTextTime: {
      fontSize: 13,
      fontWeight: '400',
      marginVertical: 4,
      color: theme.colors.baseShade1,
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 72,
      marginRight: 12,
      backgroundColor: '#D9E5FC',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightSection: {
      width: '90%',
    },
    commentBubble: {
      marginBottom: 4,
      padding: 12,
      backgroundColor: theme.colors.baseShade4,
      borderRadius: 12,
      borderTopLeftRadius: 0,
      alignSelf: 'flex-start',
    },

    viewMoreReplyBtn: {
      width: 155,
      borderRadius: 4,
      backgroundColor: theme.colors.baseShade4,
      paddingVertical: 5,
      paddingHorizontal: 8,
      marginTop: 12,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewMoreText: {
      fontWeight: '600',
      color: theme.colors.baseShade1,
      paddingHorizontal: 4,
    },
    commentText: {
      fontSize: 15,
      color: theme.colors.base,
    },
    likeBtn: {
      flexDirection: 'row',
      marginRight: 8,
      alignItems: 'center',
    },
    actionSection: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    likedText: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 1,
    },
    btnText: {
      color: theme.colors.baseShade2,
      fontSize: 14,
      fontWeight: '600',
    },
    threeDots: {
      opacity: 0.5,
      marginLeft: 5,
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
    twoOptions: {
      minHeight: 750,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 8,
    },
    dot: {
      color: theme.colors.baseShade1,
      fontWeight: '900',
      paddingHorizontal: 5,
    },
    mentionText: {
      color: theme.colors.primary,
      fontSize: 15,
    },
    inputText: {
      color: theme.colors.base,
      fontSize: 15,
    },
  });

  return styles;
};
