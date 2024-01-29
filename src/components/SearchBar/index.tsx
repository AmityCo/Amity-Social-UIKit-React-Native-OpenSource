import React from 'react';
import { TextInput } from 'react-native';
import { styles } from './styles';

export default function SearchBar({
  handleSearch,
}: {
  handleSearch: (text: string) => void;
}) {
  return (
    <TextInput
      style={styles.searchBar}
      // value={searchText}
      placeholder="Search"
      onChangeText={handleSearch}
    />
  );
}
