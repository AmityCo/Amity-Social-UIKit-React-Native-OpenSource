import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 72,
    marginRight: 15,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#292B32',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotIcon: {
    width: 16,
    height: 12,
  },
  categoryText: {
    fontSize: 13,
    color: '#636878',
    marginTop: 4,
  },
});
