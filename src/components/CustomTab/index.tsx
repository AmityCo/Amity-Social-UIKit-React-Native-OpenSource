import React, { type ReactElement, useState } from 'react';
import {
  Animated,
  type LayoutChangeEvent,
  type StyleProp,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getStyles } from './styles';
import { TabName } from '../../enum/tabNameState';

interface ICustomTab {
  onTabChange: (tabName: TabName) => void;
  tabName: TabName[];
}
const CustomTab = ({ tabName, onTabChange }: ICustomTab): ReactElement => {
  const styles = getStyles();
  const [activeTab, setActiveTab] = useState(1);
  const [indicatorAnim] = useState(new Animated.Value(0));
  const [tabOneWidth, setTabOneWidth] = useState<number>(0);
  const [tabTwoWidth, setTabTwoWidth] = useState<number>(0);
  const handleTabPress = ({
    name,
    tabIndex,
  }: {
    name: TabName;
    tabIndex: number;
  }) => {
    setActiveTab(tabIndex);
    onTabChange && onTabChange(name);
    Animated.timing(indicatorAnim, {
      toValue: tabIndex,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const getIndicatorPosition = () => {
    const tabWidth = tabOneWidth;
    const translateX = indicatorAnim.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [8, 12, tabWidth + 12],
    });
    return { transform: [{ translateX }] };
  };
  const getLayoutTabOneWidth = (event: LayoutChangeEvent) => {
    var { width } = event.nativeEvent.layout;
    setTabOneWidth(width);
  };
  const getLayoutTabTwoWidth = (event: LayoutChangeEvent) => {
    var { width } = event.nativeEvent.layout;
    setTabTwoWidth(width);
  };

  const dynamicWidthStyle: StyleProp<any> = {
    width: activeTab === 1 ? tabOneWidth - 20 : tabTwoWidth - 20,
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onLayout={getLayoutTabOneWidth}
        onPress={() => handleTabPress({ name: tabName[0], tabIndex: 1 })}
      >
        <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
          {tabName[0]}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onLayout={getLayoutTabTwoWidth}
        onPress={() => handleTabPress({ name: tabName[1], tabIndex: 2 })}
      >
        <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>
          {tabName[1]}
        </Text>
      </TouchableOpacity>
      <Animated.View
        style={[styles.indicator, getIndicatorPosition(), dynamicWidthStyle]}
      />
    </View>
  );
};
export default CustomTab;
