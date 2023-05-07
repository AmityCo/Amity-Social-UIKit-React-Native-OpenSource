import * as React from 'react';

// import { useTranslation } from 'react-i18next';

import { View } from 'react-native';
import PostList from '../../../components/Social/PostList';
import styles from './styles';

export default function GlobalFeed() {
  return (
    <View style={styles.feedWrap}>
      <PostList />
      <PostList />
      <PostList />
      <PostList />
    </View>
  );
}
