import { StyleSheet } from 'react-native';
import LoadingIndicator from '../../../components/LoadingIndicator/index';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
    padding: 16,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  dotIcon: {
    width: 16,
    height: 12,
  },
  icon: {
    width: 18,
    height: 16,
    color: '#292B32',
  },
  followIcon: {
    width: 18,
    height: 16,
    color: 'white',
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 72,
    marginRight: 10,
  },
  userInfo: {
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  horizontalText: {
    flexDirection: 'row',
  },
  textComponent: {
    marginBottom: 4,
    fontSize: 13,
  },
  editProfileButton: {
    // flex: 1,
    // backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#A5A9B5',
    padding: 8,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButton: {
    // flex: 1,
    // backgroundColor: 'white',
    // borderWidth: 1,
    // borderColor: '#A5A9B5',
    backgroundColor: '#1054DE',
    padding: 8,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 600,
    color: 'white',
  },
  editProfileText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 600,
    color: '#292B32',
  },
});
