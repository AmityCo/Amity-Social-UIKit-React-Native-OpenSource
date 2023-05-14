import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  postWrap: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  headerSection: {
    paddingVertical: 8,
    flexDirection: 'row',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 15,
  },
  headerTextTime: {
    fontSize: 13,
    fontWeight: '400',
    fontColor: '#636878',
  },
  bodySection: {
    justifyContent: 'center',
    paddingVertical: 10,
    minHeight: 45,
  },
  countSection: {
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countText: {
    fontSize: 13,
    color: '#898E9E',
  },
  bodyText: {
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  actionSection: {
    paddingVertical: 11,
    borderTopColor: '#EBECEF',
    borderTopWidth: 1,
    flexDirection: 'row',
    marginTop: 4,
  },
  likeBtn: {
    flexDirection: 'row',
    marginRight: 6,
  },
  commentBtn: {
    flexDirection: 'row',
    paddingHorizontal: 6,
  },
  btnText: {
    color: '#898E9E',
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 72,
    marginRight: 12,
    backgroundColor: '#D9E5FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
