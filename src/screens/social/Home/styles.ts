import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  feedWrap: {
    backgroundColor: '#EBECEF',
  },
  screenContainer: {
    flex: 1,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    minHeight: 120,
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  postText: {
    paddingLeft: 12,
    fontWeight: '600',
  },
  invisible: {
    display: 'none',
  },
  visible: {
    display: 'flex',
  },
});

export default styles;
