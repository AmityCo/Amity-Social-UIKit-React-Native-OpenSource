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
  likeCountText: {
    fontSize: 13,
    color: '#898E9E',
  },
  commentCountText: {
    fontSize: 13,
    color: '#898E9E',
  },
  bodyText: {
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  actionSection: {
    borderTopColor: '#EBECEF',
    borderTopWidth: 1,
    flexDirection: 'row',
    marginTop: 4,
  },
  likeBtn: {
    flexDirection: 'row',
    paddingRight: 6,
    paddingVertical: 12,
  },
  commentBtn: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 12,
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
  likedText: {
    color: '#1054DE',
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 4,
  }
});

export default styles;
