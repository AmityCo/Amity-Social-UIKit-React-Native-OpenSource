import {
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import React, { FC, memo, useCallback } from 'react';
import { TabName } from '../../../enum/tabNameState';
import { useStyles } from '../styles';

interface IGalleryTab {
  onTabChange: (tabName: TabName) => void;
  tabName: TabName[];
  curerntTab: TabName;
}

const GalleryTab: FC<IGalleryTab> = ({ tabName, onTabChange, curerntTab }) => {
  const styles = useStyles();

  const onChangeTab = useCallback(
    (tab: TabName) => {
      onTabChange(tab);
    },
    [onTabChange]
  );

  return (
    <View style={styles.tabContainer}>
      {tabName.map((tab) => {
        const isFocused = curerntTab === tab;
        const focusedTabStyle: ViewStyle = isFocused && styles.focusedTab;
        const focusedTabTextStyle: TextStyle =
          isFocused && styles.focusedTabText;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onChangeTab(tab)}
            style={[styles.tab, focusedTabStyle]}
          >
            <Text style={[styles.tabText, focusedTabTextStyle]}>{tab}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default memo(GalleryTab);
