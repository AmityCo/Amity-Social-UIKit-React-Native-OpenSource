import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const styles = StyleSheet.create({
    btnWrap: {
      padding: 5,
      marginLeft: 8
    },
    dotIcon: {
      width: 16,
      height: 12,
      marginRight: 8
    },
  });
  return styles;
};
