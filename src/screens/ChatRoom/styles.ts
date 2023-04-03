import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
  chatTime: {
    fontSize: 13,
    fontWeight: '400',
    marginVertical: 4,
    marginHorizontal: 4,
  },

  userName: {
    fontSize: 15,
    fontWeight: '400',
    marginVertical: 4,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 72,
    marginRight: 12,
    marginLeft: 16,
  },
  chatLeft: {
    alignItems: 'flex-start',
  },
  chatRight: {
    alignItems: 'flex-end',
    marginRight: 16,
  },
  chatTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  input: {
    backgroundColor: '#EBECEF',
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    width: '80%',
  },
  voiceInput: {
    backgroundColor: '#EBECEF',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    width: '75%',
    marginHorizontal: 10,
  },
  sendIcon: {
    marginRight: 6,
    padding: 5,
  },
  scrollView: {
    shadowOpacity: 0.13,
    shadowRadius: 0,
    paddingTop: 5,
    paddingHorizontal: 8,
    elevation: 1, // for Android
    shadowColor: '#000', // for iOS
    shadowOffset: {
      width: 0,
      height: -0.5,
    },
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
  voiceIcon: {
    width: 24,
    height: 20,
    resizeMode: 'contain',
    marginRight: 8,
  },
  keyboardIcon: {
    width: 24,
    height: 20,
  },
  voiceRecordContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  settingIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  sendingStatus: {
    flexDirection: 'row',
    width: 80,
  },
  chatHeader: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#EBECEF',
  },
  chatIcon: {
    width: 24,
    height: 20,
  },
});

export default styles;
