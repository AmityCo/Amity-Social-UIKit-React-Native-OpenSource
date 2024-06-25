import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback, useState } from 'react';
import { useStyles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { useUiKitConfig, useConfigImageUri } from '../../../hook';
import { ComponentID, ElementID, PageID, TabName } from '../../../enum';

type AmityTopSearchBarComponentType = {
  setSearchValue: (arg: string) => void;
  searchType: TabName;
};

const AmityTopSearchBarComponent = ({
  setSearchValue,
  searchType,
}: AmityTopSearchBarComponentType) => {
  const styles = useStyles();
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState('');
  const searchIcon = useConfigImageUri({
    configPath: {
      page: PageID.social_global_search_page,
      component: ComponentID.top_search_bar,
      element: ElementID.search_icon,
    },
    configKey: 'icon',
  });
  const clearIcon = useConfigImageUri({
    configPath: {
      page: PageID.social_global_search_page,
      component: ComponentID.top_search_bar,
      element: ElementID.clear_button,
    },
    configKey: 'icon',
  });
  const cancelText = useUiKitConfig({
    keys: ['text'],
    page: PageID.social_global_search_page,
    component: ComponentID.top_search_bar,
    element: ElementID.cancel_button,
  }) as string[];

  const onPressClear = useCallback(() => {
    setSearchValue('');
    setInputValue('');
  }, [setSearchValue]);

  const onPressCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onChangeText = useCallback(
    (text: string) => {
      setSearchValue(text);
      setInputValue(text);
    },
    [setSearchValue]
  );

  return (
    <View style={styles.headerWrap}>
      <View style={styles.inputWrap}>
        <Image
          source={searchIcon}
          style={styles.searchIcon}
          testID="top_search_bar/search_icon"
          accessibilityLabel="top_search_bar/search_icon"
        />
        <TextInput
          value={inputValue}
          style={styles.input}
          onChangeText={onChangeText}
          placeholder={
            searchType === TabName.MyCommunities
              ? 'Search my community'
              : 'Search community and user'
          }
          placeholderTextColor="grey"
        />
        {inputValue?.length > 0 && (
          <TouchableOpacity
            onPress={onPressClear}
            testID="top_search_bar/clear_button"
            accessibilityLabel="top_search_bar/clear_button"
          >
            <Image source={clearIcon} width={20} height={20} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        onPress={onPressCancel}
        testID="top_search_bar/cancel_button"
        accessibilityLabel="top_search_bar/cancel_button"
      >
        <Text style={styles.cancelBtn}>{cancelText[0]}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(AmityTopSearchBarComponent);
