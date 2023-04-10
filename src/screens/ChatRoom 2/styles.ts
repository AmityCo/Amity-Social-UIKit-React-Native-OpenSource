import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 10,
  },
  chatContainer: {
    flex: 1,
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
    backgroundColor: '#DCF8C6',
  },
  friendBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
  },
  chatText: {
    fontSize: 16,
  },
  chatTimestamp: {
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
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
});

export default styles;
