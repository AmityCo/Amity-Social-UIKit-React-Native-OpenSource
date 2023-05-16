import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '35%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    padding: 20,
  },
  overlayCommunityText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  overlayCategoryText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 50,
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  rowItem: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  rowItemContent: {
    flexDirection: 'row',
    paddingLeft: 50,
  },
  verticalLine: {
    height: 40,
    width: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 5,
  },
  rowNumber: {
    fontSize: 18,
    fontWeight: '600',
  },
  rowLabel: {
    fontSize: 16,
    color: '#898E9E',
  },
  textComponent: {
    fontSize: 16,
    paddingHorizontal: 20,
  },
});
