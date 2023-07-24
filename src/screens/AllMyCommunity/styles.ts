import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  headerWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputWrap: {
    marginHorizontal: 16,
    backgroundColor: '#EBECEF',
    padding: 12,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    flex: 2,
  },
  input: { flex: 1, marginHorizontal: 6 },
  cancelBtn: {
    marginRight: 16,
  },
  searchScrollList: {
    paddingBottom: 110,
    marginTop: 10,
  },
});
