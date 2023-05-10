import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  postWrap: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  headerSection: {
    paddingVertical: 8,
  },
  bodySection: {
    paddingVertical: 8,
    minHeight: 40,
  },
  countSection: {
    paddingVertical: 8,
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
  },
  likeBtn: {
    flexDirection: 'row',
  },
  btnText: {
    color: '#898E9E',
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 4,
  }
});

export default styles;
