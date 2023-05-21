import React, { useCallback, useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';

import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './styles';
import { SvgXml } from 'react-native-svg';
import {
  commentXml,
  likedXml,
  likeXml,
  personXml,
} from '../../../svg/svg-xml-list';

import type { UserInterface } from '../../../types/user.interface';
import {
  addPostReaction,
  removePostReaction,
} from '../../../providers/Social/feed-sdk';

export interface IPost {
  postId: string;
  data: Record<string, any>;
  dataType: string | undefined;
  myReactions: string[];
  reactionCount: Record<string, number>;
  commentsCount: number;
  user: UserInterface | undefined;
  updatedAt: string | undefined;
  editedAt: string | undefined;
  createdAt: string;
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

  const [isLike, setIsLike] = useState(false);
  const [likeReaction, setLikeReaction] = useState<number>(0);

  console.log('reactionCount: ', reactionCount);
  useEffect(() => {
    if (myReactions.length > 0 && myReactions.includes('like')) {
      setIsLike(true);
    }
    if (reactionCount.like) {
      setLikeReaction(reactionCount.like);
    }
  }, [myReactions, reactionCount]);

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

  function getTimeDifference(timestamp: string): string {
    // Convert the timestamp string to a Date object
    const timestampDate = Date.parse(timestamp);

    // Get the current date and time
    const currentDate = Date.now();

    // Calculate the difference in milliseconds
    const differenceMs = currentDate - timestampDate;

    const differenceYear = Math.floor(
      differenceMs / (1000 * 60 * 60 * 24 * 365)
    );
    const differenceDay = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    const differenceHour = Math.floor(differenceMs / (1000 * 60 * 60));
    const differenceMinutes = Math.floor(differenceMs / (1000 * 60));
    const differenceSec = Math.floor(differenceMs / 1000);

    if (differenceSec < 60) {
      return 'Just now';
    } else if (differenceMinutes < 60) {
      return (
        differenceMinutes +
        ` ${differenceMinutes === 1 ? 'min ago' : 'mins ago'}`
      );
    } else if (differenceHour < 24) {
      return (
        differenceHour + ` ${differenceHour === 1 ? 'hour ago' : 'hours ago'}`
      );
    } else if (differenceDay < 365) {
      return (
        (differenceDay !== 1 ? differenceDay : '') +
        ` ${differenceDay === 1 ? 'Yesterday' : 'days ago'}`
      );
    } else {
      return (
        differenceYear + ` ${differenceYear === 1 ? 'year ago' : 'years ago'}`
      );
    }
  }
  async function addReactionToPost() {
    setIsLike((prev) => !prev);
    if (isLike && likeReaction) {
      setLikeReaction(likeReaction - 1);
      const isRemovePost = await removePostReaction(postId, 'like');
      console.log('isRemovePost: ', isRemovePost);
    } else {
      setLikeReaction(likeReaction + 1);
      const isLikePost = await addPostReaction(postId, 'like');
      console.log('isLikePost: ', isLikePost);
    }
  }

  console.log('reactionCount: ', data.text + reactionCount.like);
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
          <Text style={styles.headerTextTime}>
            {getTimeDifference(createdAt)}
          </Text>
        </View>
      </View>
      <View style={styles.bodySection}>
        <Text style={styles.bodyText}>{data.text}</Text>
      </View>
      {likeReaction === 0 && commentsCount === 0 ? (
        ''
      ) : (
        <View style={styles.countSection}>
          {likeReaction ? (
            <Text style={styles.likeCountText}>
              {likeReaction} {renderLikeText(likeReaction)}
            </Text>
          ) : (
            <Text />
          )}
          {commentsCount > 0 && (
            <Text style={styles.commentCountText}>
              {commentsCount > 0 && commentsCount}{' '}
              {renderCommentText(commentsCount)}
            </Text>
          )}
        </View>
      )}

      <View style={styles.actionSection}>
        <TouchableOpacity
          onPress={() => addReactionToPost()}
          style={styles.likeBtn}
        >
          {isLike ? (
            <SvgXml xml={likedXml} width="20" height="16" />
          ) : (
            <SvgXml xml={likeXml} width="20" height="16" />
          )}

          <Text style={isLike ? styles.likedText : styles.btnText}>Like</Text>
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
