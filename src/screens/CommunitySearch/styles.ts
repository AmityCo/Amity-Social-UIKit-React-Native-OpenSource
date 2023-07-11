import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  headerWrap: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputWrap: {
    marginHorizontal: 16,
    backgroundColor: '#EBECEF',
    flex: 1,
    padding: 12,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  input: { flex: 1, marginHorizontal: 6 },
  cancelBtn: {
    marginRight: 16,
  },
});
