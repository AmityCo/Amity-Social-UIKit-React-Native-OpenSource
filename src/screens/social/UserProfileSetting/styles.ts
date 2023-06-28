import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navBar: {
    height: 60,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  backIcon: {
    width: 25,
    height: 25,
  },
  navBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  placeholder: {
    width: 25,
    height: 25,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    width: 18,
    height: 16,
  },
  unfollowIcon: {
    width: 18,
    height: 14,
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
  groupIcon: {
    width: 16,
    height: 16,
  },
  arrowIcon: {
    width: 10,
    height: 17,
  },
  rowText: {
    flex: 1,
    fontSize: 16,
  },
  leaveChatContainer: {
    alignItems: 'center',
    // paddingVertical: 15,
  },
  leaveChatText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF0000',
  },
  leaveChatLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'red',
  },
});
