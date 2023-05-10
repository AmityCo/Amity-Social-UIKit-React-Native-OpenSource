import * as React from 'react';
// import { useTranslation } from 'react-i18next';

import { View, Text } from 'react-native';
import type { UserInterface } from '../../../types/user.interface';
import styles from './styles';
import { SvgXml } from 'react-native-svg';
import { likeXml } from '../../../svg/svg-xml-list';

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
      <View style={styles.headerSection}>
        <Text>Top Thanaphon</Text>
      </View>
      <View style={styles.bodySection}>
        <Text style={styles.bodyText}>Post 555</Text>
      </View>
      <View style={styles.countSection}>
        <Text style={styles.countText}>100 likes</Text>
      </View>
      <View style={styles.actionSection}>
        <View style={styles.likeBtn}>
        <SvgXml xml={likeXml} width="20" height="16" />
        <Text style={styles.btnText}>Like</Text>
        </View>
      
      </View>
    </View>
  );
}
