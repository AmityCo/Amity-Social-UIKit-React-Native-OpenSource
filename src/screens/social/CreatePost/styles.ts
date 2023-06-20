import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  barContainer: {
    backgroundColor: 'white',
  },
  header: {
    zIndex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    padding: 10,
    zIndex: 1,
    left: 4,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 17,
    textAlign: 'center',
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  textInput: {
    borderWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
    fontSize: 15,
    // Additional styles if needed
  },
  container: {
    padding: 16,
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
});
