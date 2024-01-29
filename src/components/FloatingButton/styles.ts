import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 135,
    right: 10,
  },
  otherFeedContainer: {
    position: 'absolute',
    bottom: 35,
    right: 10,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 35,
    backgroundColor: '#1054DE',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
});
