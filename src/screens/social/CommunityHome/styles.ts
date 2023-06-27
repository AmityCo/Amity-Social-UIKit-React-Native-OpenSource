import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  joinContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinCommunityButton: {
    // flex: 1,
    // backgroundColor: 'white',
    // borderWidth: 1,
    // borderColor: '#A5A9B5',
    backgroundColor: '#1054DE',
    width: '90%',
    padding: 8,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinCommunityText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 600,
    color: 'white',
  },
  dotIcon: {
    width: 16,
    height: 12,
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
  joinIcon: {
    width: 18,
    height: 16,
    color: 'white',
  },
  overlayCategoryText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 30,
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
    paddingTop: 15,
    paddingHorizontal: 20,
  },
});
