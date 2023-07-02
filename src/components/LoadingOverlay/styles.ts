import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    // ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
