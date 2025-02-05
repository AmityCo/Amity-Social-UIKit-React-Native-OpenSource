import { View, useWindowDimensions } from 'react-native';
import React from 'react';
import { useStyles } from './styles';
import {
  Facebook,
} from 'react-content-loader/native';
import { Divider, useTheme } from 'react-native-paper';

import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

const NewsFeedLoadingComponent = () => {
  const styles = useStyles();
  const theme = useTheme() as MyMD3Theme;
  const { width } = useWindowDimensions();
  return (
    <View style={styles.container} >
      {Array.from({ length: 6 }, (_, i) => (
        <View style={styles.postCard} key={i}>
          <Facebook
            width={width}
            foregroundColor={theme.colors.baseShade4}
            speed={0.5}
          />
          <Divider />
        </View>
      ))}
    </View>
  );
};

export default NewsFeedLoadingComponent;
