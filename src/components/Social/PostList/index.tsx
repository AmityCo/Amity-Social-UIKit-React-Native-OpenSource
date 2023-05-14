import React, { useEffect } from 'react';
// import { useTranslation } from 'react-i18next';

import { View, Text, TouchableOpacity, Image } from 'react-native';
import type { UserInterface } from '../../../types/user.interface';
import styles from './styles';
import { SvgXml } from 'react-native-svg';
import { commentXml, likeXml, personXml } from '../../../svg/svg-xml-list';
import { getAmityUser } from '../../../providers/user-provider';

interface IPost {
  postId: string;
  data: string;
  totalReaction: number;
  commentNumber: number;
  updatedAt: string;
  user: UserInterface;
}
export default function PostList({ user }: IPost) {
  async function getUserInfo(): Promise<void> {
    const res = await getAmityUser('top');
    console.log('res: ', res);
  }
  useEffect( () => {
    getUserInfo();
    console.log('========test=========');
  }, []);

  return (
    <View style={styles.postWrap}>
      <View style={styles.headerSection}>
        {user?.avatarFileId ? (
          <Image
            style={styles.avatar}
            source={{
              uri: `https://api.amity.co/api/v3/files/${user?.avatarFileId}/download`,
            }}
          />
        ) : (
          <View style={styles.avatar}>
            <SvgXml xml={personXml} width="20" height="16" />
          </View>
        )}

        <View>
          <Text style={styles.headerText}>Top Thanaphon</Text>
          <Text>30 min</Text>
        </View>
      </View>
      <View style={styles.bodySection}>
        <Text style={styles.bodyText}>Post test 1234</Text>
      </View>
      <View style={styles.countSection}>
        <Text style={styles.countText}>100 likes</Text>
        <Text style={styles.countText}>10 comments</Text>
      </View>
      <View style={styles.actionSection}>
        <TouchableOpacity onPress={() => getUserInfo()} style={styles.likeBtn}>
          <SvgXml xml={likeXml} width="20" height="16" />
          <Text style={styles.btnText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => getUserInfo()}
          style={styles.commentBtn}
        >
          <SvgXml xml={commentXml} width="20" height="16" />
          <Text style={styles.btnText}>Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
