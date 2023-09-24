import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 35 : 10, // Adjust for Android status bar
    paddingHorizontal: 15,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Adjust for iOS notch
    zIndex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  closeButton: {
    zIndex: 1,
    padding: 10,
  },
  headerTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 17,
    textAlign: 'center',
  },
  communityText: {
    marginLeft: 12,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  myCommunityText: {
    color: '#292B32',
    padding: 16,
    opacity: 0.4,
    fontSize: 17,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  rowContainerMyTimeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    paddingTop: 26,
    paddingHorizontal: 16,
    borderBottomColor: '#EBECEF',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#D9E5FC',
  },
  LoadingIndicator: {
    paddingVertical: 20,
  },
  barContainer: {
    backgroundColor: 'white',
  },

  postText: {
    fontWeight: '400',
    fontSize: 15,
    textAlign: 'center',
    color: '#1054DE',
  },


  textInput: {
    borderWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
    fontSize: 15,
    marginHorizontal: 3,
    // Additional styles if needed
  },

  AllInputWrap: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  InputWrap: {
    backgroundColor: '#FFFFF',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    paddingBottom: 35,
    paddingTop: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EBECEF',
  },
  iconWrap: {
    backgroundColor: '#EBECEF',
    borderRadius: 72,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    width: 35,
    height: 35,
  },
  imageContainer: {
    flexDirection: 'row',
    marginVertical: 30,
    flex: 3,
  },
  disabled: {
    opacity: 0.3,
  },
  videoContainer: {
    display: 'none',
  }
});
