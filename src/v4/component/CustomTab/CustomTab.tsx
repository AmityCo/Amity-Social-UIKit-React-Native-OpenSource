import {
  ScrollView,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, { FC, memo, useState } from 'react';
import { useStyles } from './styles';
import { TabName } from '../../enum/enumTabName';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '~/providers/amity-ui-kit-provider';

type TCustomTab = {
  onTabChange: (tabName: TabName) => void;
  tabNames: TabName[] | string[];
};

const CustomTab: FC<TCustomTab> = ({ tabNames, onTabChange }) => {
  const styles = useStyles();
  const theme = useTheme() as MyMD3Theme;
  const [currentTab, setCurrentTab] = useState(tabNames[0]);

  return (
    <View style={styles.tabContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabNames.map((tabName) => {
          const onPressTab = () => {
            setCurrentTab(tabName);
            onTabChange(tabName);
          };
          const pressedBtnStyle: ViewStyle = currentTab === tabName && {
            backgroundColor: theme.colors.primary,
          };
          const pressedTabName: TextStyle = currentTab === tabName && {
            color: '#ffffff',
          };
          return (
            <TouchableOpacity
              style={[styles.tabBtn, pressedBtnStyle]}
              onPress={onPressTab}
            >
              <Text style={[styles.tabName, pressedTabName]}>{tabName}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default memo(CustomTab);
