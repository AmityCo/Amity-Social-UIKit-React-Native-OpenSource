import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const getStyles = () => {
  const theme = useTheme() as MyMD3Theme;

  const styles = StyleSheet.create({
    commentWrap: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: 12,
      width: '100%',
      borderBottomColor: '#EBECEF',
      borderBottomWidth: 1,
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
      marginTop: 3,
      color: theme.colors.base,
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
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rightSection: {
      width: '90%',
    },
    commentBubble: {
      padding: 12,
      backgroundColor: theme.colors.secondary,
      marginVertical: 8,
      borderRadius: 12,
      borderTopLeftRadius: 0,
      alignSelf: 'flex-start',
    },
    commentText: {
      fontSize: 15,
      color: theme.colors.base,
    },
    likeBtn: {
      flexDirection: 'row',
      paddingRight: 6,
      paddingTop: 4,
    },
    actionSection: {
      flexDirection: 'row',
    },
    likedText: {
      color: theme.colors.primary,
      fontSize: 15,
      fontWeight: '600',
      marginHorizontal: 4,
    },
    btnText: {
      color: theme.colors.baseShade2,
      fontSize: 15,
      fontWeight: '600',
      marginHorizontal: 4,
    },
    threeDots: {
      padding: 5,
      opacity: 0.5,
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
    deleteText: {
      paddingLeft: 12,
      fontWeight: '600',
      color: theme.colors.base,
    },
    twoOptions: {
      minHeight: 720,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
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
