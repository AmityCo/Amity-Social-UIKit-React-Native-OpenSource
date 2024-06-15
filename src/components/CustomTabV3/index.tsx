import React, { type ReactElement, useState } from 'react';
import {
  Animated,
  type LayoutChangeEvent,
  type StyleProp,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useStyles } from './styles';
import { TabName } from '../../enum/tabNameState';

interface ICustomTab {
  onTabChange: (tabName: TabName) => void;
  tabName: TabName[];
}
const CustomTab = ({ tabName, onTabChange }: ICustomTab): ReactElement => {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState(1);
  const [indicatorAnim] = useState(new Animated.Value(0));
  const [tabOneWidth, setTabOneWidth] = useState<number>(0);
  const [tabTwoWidth, setTabTwoWidth] = useState<number>(0);
  const [tabThreeWidth, setTabThreeWidth] = useState<number>(0);

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
      inputRange: [0, 1, 2, 3],
      outputRange: [8, 12, tabWidth + 12, tabOneWidth + tabTwoWidth + 12],
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
  const getLayoutTabThreeWidth = (event: LayoutChangeEvent) => {
    var { width } = event.nativeEvent.layout;
    setTabThreeWidth(width);
  };
  const dynamicWidthStyle: StyleProp<any> = {
    width:
      activeTab === 1
        ? tabOneWidth - 20
        : activeTab === 2
        ? tabTwoWidth - 20
        : activeTab === 3
        ? tabThreeWidth - 20
        : undefined,
  };
  return (
    <View style={styles.container}>
      {tabName.map((tab, index) => {
        const onLayout =
          index === 0
            ? getLayoutTabOneWidth
            : index === 1
            ? getLayoutTabTwoWidth
            : getLayoutTabThreeWidth;
        return (
          <TouchableOpacity
            key={tab}
            onLayout={onLayout}
            onPress={() => handleTabPress({ name: tab, tabIndex: index + 1 })}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index + 1 && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
      <Animated.View
        style={[styles.indicator, getIndicatorPosition(), dynamicWidthStyle]}
      />
    </View>
  );
};
export default CustomTab;
