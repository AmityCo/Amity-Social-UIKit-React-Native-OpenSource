import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  chatBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '70%',
    padding: 10,
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 5,
    height: 60,
    alignItems: 'center'
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

    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    backgroundColor: 'white',
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
});

export default styles;
