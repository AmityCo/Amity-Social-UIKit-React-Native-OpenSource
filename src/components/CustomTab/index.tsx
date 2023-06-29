import React, { ReactElement, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';


interface ICustomTab {
  onTabChange: (tabIndex: number) => any;
  tabName: string[];
}
const CustomTab = ({ tabName, onTabChange }: ICustomTab): ReactElement => {
  const [activeTab, setActiveTab] = useState(1);
  const [indicatorAnim] = useState(new Animated.Value(0));

  const handleTabPress = (tabIndex: number) => {
    setActiveTab(tabIndex);
    onTabChange && onTabChange(tabIndex);
    Animated.timing(indicatorAnim, {
      toValue: tabIndex,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const getIndicatorPosition = () => {
    const tabWidth = 102;
    const translateX = indicatorAnim.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [10, 10, 8 + tabWidth],
    });
    return { transform: [{ translateX }] };
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleTabPress(1)}>
        <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
          {tabName[0]}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleTabPress(2)}>
        <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>
        {tabName[1]}
        </Text>
      </TouchableOpacity>
      <Animated.View style={[styles.indicator, getIndicatorPosition()]} />
    </View>
  );
};
export default CustomTab;
