import { View, useWindowDimensions } from 'react-native';
import React from 'react';
import { useStyles } from './styles';
import ContentLoader, {
  Circle,
  Facebook,
  Rect,
} from 'react-content-loader/native';
import { Divider } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

const NewsFeedLoadingComponent = () => {
  const styles = useStyles();
  const theme = useTheme() as MyMD3Theme;
  const { width } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <View style={styles.storiesContainer}>
        {Array.from({ length: 6 }, (_, i) => (
          <ContentLoader
            key={i}
            height={70}
            speed={0.5}
            width={70}
            backgroundColor={theme.colors.baseShade4}
            foregroundColor={theme.colors.baseShade2}
            viewBox="0 0 70 70"
          >
            <Circle cx="25" cy="25" r="25" />
            <Rect x="0" y="60" rx="4" ry="4" width={50} height={8} />
          </ContentLoader>
        ))}
      </View>
      <ContentLoader
        height={70}
        speed={0.5}
        width={width}
        backgroundColor={theme.colors.baseShade4}
        foregroundColor={theme.colors.baseShade2}
        viewBox={`0 0 ${width} 70`}
      >
        <Rect x="0" y="34" rx="4" ry="4" width="300" height="13" />
      </ContentLoader>
      {Array.from({ length: 5 }, (_, i) => (
        <View key={i}>
          <Facebook
            width={width}
            backgroundColor={theme.colors.baseShade4}
            foregroundColor={theme.colors.baseShade2}
            speed={0.5}
          />
          <Divider style={{ backgroundColor: theme.colors.baseShade2 }} />
        </View>
      ))}
    </View>
  );
};

export default NewsFeedLoadingComponent;
