import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
// import { useTranslation } from 'react-i18next';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  StyleProp,
  ImageStyle,
} from 'react-native';
import styles from './styles';
import { SvgXml } from 'react-native-svg';
import {
  arrowXml,
  commentXml,
  likedXml,
  likeXml,
  personXml,
  playBtn,
  replyIcon,
} from '../../../svg/svg-xml-list';

import type { UserInterface } from '../../../types/user.interface';
import {
  addPostReaction,
  getPostById,
  removePostReaction,
} from '../../../providers/Social/feed-sdk';
import { getCommunityById } from '../../../providers/Social/communities-sdk';
import ImageView from '../../../components/react-native-image-viewing/dist';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface IComment {
  commentId: string;
  data: Record<string, any>;
  dataType: string | undefined;
  myReactions: string[];
  reactions: Record<string, number>;
  user: UserInterface | undefined;
  updatedAt: string | undefined;
  editedAt: string | undefined;
  createdAt: string;
  childrenComment: string[];
}
export interface ICommentList {
  commentDetail: IComment;
}

export default function CommentList({ commentDetail }: ICommentList) {
  const { commentId, data, user, createdAt, reactions, myReactions } =
    commentDetail;
  const [isLike, setIsLike] = useState<boolean>(
    myReactions ? myReactions.includes('like') : false
  );

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

  const addReactionToComment: () => void = () => {
    setIsLike((prev) => !prev);
  };
  return (
    <View key={commentId} style={styles.commentWrap}>
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
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>{user?.displayName}</Text>
          </View>

          <Text style={styles.headerTextTime}>
            {getTimeDifference(createdAt)}
          </Text>
          <View style={styles.commentBubble}>
            <Text style={styles.commentText}>{data.text}</Text>
          </View>
          <View style={styles.actionSection}>
            <TouchableOpacity
              onPress={() => addReactionToComment()}
              style={styles.likeBtn}
            >
              {isLike ? (
                <SvgXml xml={likedXml} width="20" height="16" />
              ) : (
                <SvgXml xml={likeXml} width="20" height="16" />
              )}

              <Text style={isLike ? styles.likedText : styles.btnText}>
                {reactions.like}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={() => addReactionToComment()}
              style={styles.likeBtn}
            >
              <SvgXml xml={replyIcon} width="20" height="16" />

              <Text style={styles.btnText}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
