import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const styles = StyleSheet.create({
    btnWrap: {
      padding: 5,
    },
    dotIcon: {
      width: 16,
      height: 12,
    },
  });
  return styles;
};
