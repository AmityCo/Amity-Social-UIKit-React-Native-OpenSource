import * as React from 'react';
// import { useTranslation } from 'react-i18next';

import { View, Text } from 'react-native';
import type { UserInterface } from '../../../types/user.interface';
import styles from './styles';

interface IPost {
  postId: string;
  data: string;
  totalReaction: number;
  commentNumber: number;
  updatedAt: string;
  user: UserInterface;
}
export default function PostList({}: IPost) {
  return (
    <View style={styles.postWrap}>
      <Text>Post</Text>
    </View>
  );
}
