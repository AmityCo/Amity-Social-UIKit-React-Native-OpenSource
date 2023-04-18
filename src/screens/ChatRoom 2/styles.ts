import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  textChatBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
  },
  imageChatBubble: {
    marginVertical: 5,
    borderRadius: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1054DE',
  },
  friendBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#EBECEF',
  },
  chatUserText: {
    fontSize: 16,
    color: 'white',
  },
  chatFriendText: {
    fontSize: 16,
    color: 'black',
  },
  chatTimestamp: {
    fontSize: 13,
    color: '#898E9E',
    marginTop: 4,
  },
  AllInputWrap: {
    backgroundColor: '#FFFFFF',
  },
  InputWrap: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 25,
    paddingTop: 10,
    alignItems: 'center',

  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },

  input: {
    backgroundColor: '#EBECEF',
    borderRadius: 20,
    fontSize: 15,
    color: 'black',
    width: '80%',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sendButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomColor: '#EBECEF',
    borderBottomWidth: 1,

  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 72,
    marginRight: 8,
    marginLeft: 10,
  },
  chatName: {
    fontSize: 17,
    fontWeight: '600',
    width: 'auto',
    maxWidth: 200,
  },
  icon: {
    backgroundColor: '#D9E5FC',
    width: 42,
    height: 42,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 72,
    marginRight: 8,
    marginLeft: 10,
  },
  chatMember: {
    marginTop: 2,
  },
  chatIcon: {
    width: 24,
    height: 20,
  },
  settingIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  chatTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendIcon: {
    marginRight: 6,
    padding: 8,
  },
  IconCircle: {
    width: 50,
    height: 50,
    backgroundColor: '#EBECEF',
    borderRadius: 72,
    padding: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 7,
  },
  expandedArea: {
    height: 220,
    flexDirection: 'row',
    marginVertical: 15,
    backgroundColor: 'white',
  },
  imageMessage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 72,
    marginRight: 12,
  },
  leftMessageWrap: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  rightMessageWrap: {
    marginVertical: 10,
  },
});

export default styles;
