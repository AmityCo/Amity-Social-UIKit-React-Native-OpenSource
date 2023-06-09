import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  commentWrap: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    width: '90%',
    borderBottomColor: '#EBECEF',
    borderBottomWidth: 1,
  },
  headerSection: {
    paddingVertical: 8,
    flexDirection: 'row',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 15,
    marginTop: 3,
  },
  headerTextTime: {
    fontSize: 13,
    fontWeight: '400',
    color: '#636878',
    marginVertical: 4,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 72,
    marginRight: 12,
    backgroundColor: '#D9E5FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentBubble: {
    padding: 12,
    backgroundColor: '#EBECEF',
    marginVertical: 8,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    alignSelf: 'flex-start',
  },
  commentText: {
    fontSize: 15,
  },
  likeBtn: {
    flexDirection: 'row',
    paddingRight: 6,
    paddingVertical: 12,
  },
  actionSection: {
    flexDirection: 'row',
  },
  likedText: {
    color: '#1054DE',
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  btnText: {
    color: '#898E9E',
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 4,
  },
});

export default styles;
