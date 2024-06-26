import { StyleSheet, Text, View, Image } from 'react-native';
import React, { memo } from 'react';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '~/providers/amity-ui-kit-provider';
const NoSearchResult = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    img: {
      width: 60,
      height: 60,
      tintColor: theme.colors.baseShade4,
    },
    noResultText: {
      fontSize: 17,
      fontWeight: 'bold',
      color: theme.colors.baseShade3,
      marginTop: 12,
    },
  });
  return (
    <View style={styles.container}>
      <Image
        style={styles.img}
        source={require('../../assets/icon/noSearchResult.png')}
      />
      <Text style={styles.noResultText}>No results found</Text>
    </View>
  );
};

export default memo(NoSearchResult);
