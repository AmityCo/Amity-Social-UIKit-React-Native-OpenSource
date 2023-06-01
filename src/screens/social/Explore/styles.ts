import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 10,
    paddingVertical: 15,
  },
  recommendContainer: {
    backgroundColor: '#EBECEF',
    paddingLeft: 15,
    paddingVertical: 10,
  },
  trendingContainer: {
    paddingLeft: 15,
    paddingVertical: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
  },
  trendingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    width: 175,
    // height: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
    padding: 15,
    // alignItems: 'left',
  },
  recommendSubDetail: {
    fontSize: 13,
    marginBottom: 5,
    color: '#636878',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
  },
  name: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 5,
  },
  bio: {
    // textAlign: 'center',
    color: '#292B32',
    fontSize: 13,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  number: {
    fontSize: 18,
    fontWeight: 600,
    marginHorizontal: 12,
    color: '#1054DE',
    paddingBottom: 10,
  },
  memberContainer: {
    alignItems: 'flex-start',
  },
  memberTextContainer: {
    alignItems: 'flex-start',
    paddingBottom: 10, // Added to horizontally center the text within memberContainer
  },
  memberText: {
    fontSize: 18,
    fontWeight: 600,
    marginRight: 4,
  },
  memberCount: {
    fontSize: 13,
    fontWeight: 400,
    color: '#636878',
    marginRight: 4,
  },
  categoriesContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  arrowIcon: {
    width: 10,
    height: 17,
    marginRight: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // paddingLeft: 10,
    marginBottom: 10,
  },
  column: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  columnText: {
    fontSize: 16,
    fontWeight: 600,
    marginLeft: 10,
    marginBottom: 10,
  },
});
