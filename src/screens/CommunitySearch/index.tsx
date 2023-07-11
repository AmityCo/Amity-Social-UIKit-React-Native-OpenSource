import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import debounce from 'lodash.debounce';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { SvgXml } from 'react-native-svg';
import { circleCloseIcon, searchIcon } from '../../svg/svg-xml-list';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomTab from '../../components/CustomTab';
const fruits = [
  'apple',
  'orange',
  'banana',
  'pear',
  'grapefruit',
  'peach',
  'apricot',
  'nectarine',
  'plum',
  'mango',
  'strawberry',
  'blueberry',
  'kiwi',
  'passionfruit',
  'raspberry',
  'watermelon',
];

export default function CommunitySearch() {
  const [searchTerm, setSearchTerm] = useState('');

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  let listToDisplay = fruits;

  const handleChange = (text: string) => {
    setSearchTerm(text);
  };

  const renderFruitList = () => {
    return listToDisplay.map((fruit, i) => <Text key={i}>{fruit}</Text>);
  };

  if (searchTerm !== '') {
    listToDisplay = fruits.filter((fruit) => {
      return fruit.includes(searchTerm);
    });
  }

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  const clearButton = () => {
    console.log('clearButton: ');
    setSearchTerm('');
  };

  const cancelSearch = () => {
    navigation.goBack();
  };
  const handleTabChange = (index: number) => {
    console.log('index: ', index);
  };
  return (
    <SafeAreaView>
      <View style={styles.headerWrap}>
        <View style={styles.inputWrap}>
          <SvgXml xml={searchIcon} width="20" height="20" />
          <TextInput
            style={styles.input}
            value={searchTerm}
            onChangeText={handleChange}
          />
          <TouchableOpacity onPress={clearButton}>
            <SvgXml xml={circleCloseIcon} width="20" height="20" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={cancelSearch}>
          <Text style={styles.cancelBtn}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <CustomTab
        tabName={['Communities', 'Accounts']}
        onTabChange={handleTabChange}
      />
      {renderFruitList()}
    </SafeAreaView>
  );
}
