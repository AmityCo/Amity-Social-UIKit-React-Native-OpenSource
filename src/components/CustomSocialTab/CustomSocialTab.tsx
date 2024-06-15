import {
  ScrollView,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, { FC, memo } from 'react';
import { useStyles } from './styles';
import { TabName } from '../../enum/enumTabName';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

type TCustomTab = {
  onTabChange: (tabName: TabName) => void;
  tabNames: TabName[] | string[];
  activeTab: TabName | string;
};

const CustomSocialTab: FC<TCustomTab> = ({
  tabNames,
  onTabChange,
  activeTab,
}) => {
  const styles = useStyles();
  const theme = useTheme() as MyMD3Theme;

  return (
    <View style={styles.tabContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabNames.map((tabName: TabName) => {
          const onPressTab = () => {
            onTabChange(tabName);
          };
          const pressedBtnStyle: ViewStyle = activeTab === tabName && {
            backgroundColor: theme.colors.primary,
          };
          const pressedTabName: TextStyle = activeTab === tabName && {
            color: '#ffffff',
          };
          return (
            <TouchableOpacity
              style={[styles.tabBtn, pressedBtnStyle]}
              onPress={onPressTab}
              key={tabName}
            >
              <Text style={[styles.tabName, pressedTabName]}>{tabName}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default memo(CustomSocialTab);
