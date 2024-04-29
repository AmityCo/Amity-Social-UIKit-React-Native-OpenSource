import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '~/providers/amity-ui-kit-provider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../RouteParamList';

const AmitySocialHomeTopNavigationComponent = () => {
  const theme = useTheme() as MyMD3Theme;
  const navigation =
    useNavigation() as NativeStackNavigationProp<RootStackParamList>;
  const styles = StyleSheet.create({
    headerContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: 32,
    },
    title: {
      fontWeight: 'bold',
      color: theme.colors.base,
      fontSize: 20,
    },
    flexContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBtn: {
      borderRadius: 50,
      backgroundColor: theme.colors.baseShade4,
      padding: 4,
      marginHorizontal: 4,
    },
    icon: {
      width: 20,
      height: 20,
      tintColor: theme.colors.base,
    },
  });

  const onPressSearch = useCallback(() => {
    navigation.navigate('CommunitySearch');
  }, [navigation]);

  const onPressCreateCommunity = useCallback(() => {
    navigation.navigate('CreateCommunity');
  }, [navigation]);

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Community</Text>
      <View style={styles.flexContainer}>
        <TouchableOpacity style={styles.iconBtn} onPress={onPressSearch}>
          <Image
            source={require('../../v4/configAssets/icons/search.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onPressCreateCommunity}
        >
          <Image
            source={require('../../v4/configAssets/icons/plus.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(AmitySocialHomeTopNavigationComponent);
