import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  fontStyle: {
    color: '#1054DE',
    fontWeight: '500',
    margin: 5,
    fontSize: 17,
  },

  tabStyle: {
    backgroundColor: '#FFFFF',
    minHeight: 30,
    width: 100,
    padding: 6,
  },
  indicatorStyle: {
    backgroundColor: '#1054DE',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  addChatIcon: {
    width: 24,
    height: 20,
    resizeMode: 'contain',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
  },
  tabView: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBECEF',
    flexDirection: 'row',
  },
  tabViewTitle: {
    // paddingHorizontal:20,
    paddingVertical: 14,
    fontWeight: '600',
    fontSize: 17,
    color: '#1054DE',
    borderBottomColor: '#1054DE',
    alignSelf: 'flex-start',
  },
  indicator: {
    borderBottomWidth: 2,
    borderBottomColor: '#1054DE',
    marginHorizontal: 20,
  },
});

export default styles;
