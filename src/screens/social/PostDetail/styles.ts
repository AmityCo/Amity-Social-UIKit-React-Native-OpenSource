import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    backgroundColor: '#EBECEF',
    borderRadius: 20,
    fontWeight: '400',
    width: '90%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    // height: 40,
    // borderWidth: 1,
    // paddingHorizontal: 8,
    // marginBottom: 16,
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
  },
  AllInputWrap: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  InputWrap: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 25,
    paddingTop: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EBECEF',
  },
  postDisabledBtn: {
    color: '#A0BDF8',
    fontSize: 16,
  },
  commentItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  comment: {
    fontSize: 14,
  },
  commentListWrap: {
    borderTopWidth: 1,
    borderTopColor: '#EBECEF',
    paddingTop: 5,
  },
});
