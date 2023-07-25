import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  uploadContainer: {
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  defaultImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#898e9e'
  },
  image: {
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  btnWrap: {
    padding: 10,
  },
  allInputContainer: {
    paddingVertical: 24,
  },
  inputContainer: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginBottom: 24,
  },

  inputTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#292B32',
  },
  requiredField: {
    color: 'red',
  },
  inputField: {
    borderBottomWidth: 1,
    borderBottomColor: '#EBECEF',
    borderRadius: 5,
    marginTop: 5,
    paddingVertical: 16,
  },
  inputLengthMeasure: {
    alignSelf: 'flex-end',
    marginTop: 5,
    color: 'grey',
  },
  placeHolderText: {
    color: '#A5A9B5',
  },
  titleRow:{
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
  },
  categoryContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBECEF',
  },
  categoryInput: {
    flex: 1,
  },
  arrowIcon:{
    opacity: 0.75
  }
});

