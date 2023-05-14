import React, { useEffect } from 'react';

// import { useTranslation } from 'react-i18next';

import { View } from 'react-native';
import { getGlobalFeed } from '../../..//providers/Social/feed-sdk';
import useAuth from '../../..//hooks/useAuth';
import PostList from '../../../components/Social/PostList';
import styles from './styles';

export default function GlobalFeed() {
  const { client } = useAuth();
  async function getGlobalFeedList(): Promise<void> {
    const res = await getGlobalFeed();
    console.log('res: ', res);
  }
  useEffect(() => {
    getGlobalFeedList();
  }, [client]);

  return (
    <View style={styles.feedWrap}>
      <PostList />
      <PostList />
      <PostList />
      <PostList />
    </View>
  );
}
