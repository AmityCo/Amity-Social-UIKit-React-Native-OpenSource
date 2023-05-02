import * as React from 'react';
import { ReactElement, useState } from 'react';
// import { useTranslation } from 'react-i18next';

import { View, Text, TouchableOpacity, Animated } from 'react-native';
import useAuth from '../../../hooks/useAuth';
import Explore from '../Explore';
import GlobalFeed from '../GlobalFeed';
import styles from './styles';

export default function Home({ navigation }: any) {
  // const { t, i18n } = useTranslation();
  const { client, isConnecting } = useAuth();
  console.log('client: ', client);
  const [activeTab, setActiveTab] = useState(1);
  const [indicatorAnim] = useState(new Animated.Value(0));

  const handleTabPress = (tabIndex: number) => {
    setActiveTab(tabIndex);
    Animated.timing(indicatorAnim, {
      toValue: tabIndex,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const getIndicatorPosition = () => {
    const tabWidth = 100;
    const translateX = indicatorAnim.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [10, 10, 9 + tabWidth],
    });
    return { transform: [{ translateX }] };
  };

  const renderTabView = (): ReactElement => {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handleTabPress(1)}>
          <Text
            style={[styles.tabText, activeTab === 1 && styles.activeTabText]}
          >
            Newsfeed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress(2)}>
          <Text
            style={[styles.tabText, activeTab === 2 && styles.activeTabText]}
          >
            Explore
          </Text>
        </TouchableOpacity>
        <Animated.View style={[styles.indicator, getIndicatorPosition()]} />
      </View>
    );
  };
  const renderTabComponent = () => {
    switch (activeTab) {
      case 1:
        return <GlobalFeed />;
      case 2:
        return <Explore />;

      default:
        <GlobalFeed />;
    }
  };
  return (
    <View>
      {renderTabView()}
      {renderTabComponent()}
    </View>
  );
}
