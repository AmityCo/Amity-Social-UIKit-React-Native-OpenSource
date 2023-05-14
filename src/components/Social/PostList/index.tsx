import React, { useCallback, useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';

import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './styles';
import { SvgXml } from 'react-native-svg';
import { commentXml, likeXml, personXml } from '../../../svg/svg-xml-list';
import { getAmityUser } from '../../../providers/user-provider';
import type { UserInterface } from '../../../types/user.interface';

export interface IPost {
  postId: string;
  data: Record<string, any>;
  dataType: string | undefined;
  myReactions: string[] | [];
  reactionCount: Record<string, number>;
  commentsCount: number;
  user: UserInterface | undefined;
  updatedAt: string | undefined;
  editedAt: string | undefined;
  createdAt: string | undefined;
}
export interface IPostList {
  postDetail: IPost;
}
export default function PostList({ postDetail }: IPostList) {
  const {
    postId,
    data,
    dataType,
    myReactions,
    reactionCount,
    commentsCount,
    postedUserId = '',
    updatedAt,
    editedAt,
    createdAt,
    user,
  } = postDetail ?? {};

  function renderLikeText(likeNumber: number | undefined): string {
    if (!likeNumber) {
      return '';
    } else if (likeNumber === 1) {
      return 'like';
    } else {
      return 'likes';
    }
  }
  function renderCommentText(commentNumber: number | undefined): string {
    if (commentNumber === 0) {
      return '';
    } else if (commentNumber === 1) {
      return 'comment';
    } else {
      return 'comments';
    }
  }
  return (
    <View key={postId} style={styles.postWrap}>
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
          <Text style={styles.headerText}>{user?.displayName}</Text>
          <Text style={styles.headerTextTime}>30 min</Text>
        </View>
      </View>
      <View style={styles.bodySection}>
        <Text style={styles.bodyText}>{data.text}</Text>
      </View>
      {reactionCount && commentsCount > 0 && (
        <View style={styles.countSection}>
          <Text style={styles.countText}>
            {reactionCount.like} {renderLikeText(reactionCount.like)}
          </Text>
          <Text style={styles.countText}>
            {commentsCount > 0 && commentsCount}{' '}
            {renderCommentText(commentsCount)}
          </Text>
        </View>
      )}

      <View style={styles.actionSection}>
        <TouchableOpacity
          onPress={() => console.log('like')}
          style={styles.likeBtn}
        >
          <SvgXml xml={likeXml} width="20" height="16" />
          <Text style={styles.btnText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log('comment')}
          style={styles.commentBtn}
        >
          <SvgXml xml={commentXml} width="20" height="16" />
          <Text style={styles.btnText}>Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
