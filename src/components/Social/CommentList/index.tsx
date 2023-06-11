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
  FlatList,
} from 'react-native';
import styles from './styles';
import { SvgXml } from 'react-native-svg';
import {
  likedXml,
  likeXml,
  personXml,
  replyIcon,
} from '../../../svg/svg-xml-list';

import type { UserInterface } from '../../../types/user.interface';

import {
  addCommentReaction,
  getCommentsDataByIds,
  removeCommentReaction,
} from '../../../providers/Social/comment-sdk';

import { getAmityUser } from '../../../providers/user-provider';

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
  referenceId: string;
}
export interface ICommentList {
  commentDetail: IComment;
  isReplyComment?: boolean;
}

export default function CommentList({
  commentDetail,
  isReplyComment = false,
}: ICommentList) {
  const {
    commentId,
    data,
    user,
    createdAt,
    reactions,
    myReactions,
    childrenComment,
  } = commentDetail;
  const [isLike, setIsLike] = useState<boolean>(
    myReactions ? myReactions.includes('like') : false
  );
  console.log('isLike: ', isLike);
  const [likeReaction, setLikeReaction] = useState<number>(
    reactions.like ? reactions.like : 0
  );

  const [commentList, setCommentList] = useState<IComment[]>([]);
  console.log('replyCommentList: ', commentList);

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

  const formatComments = useCallback(async (replyComments) => {
    if (replyComments && replyComments.length > 0) {
      const formattedCommentList = await Promise.all(
        replyComments.map(async (item: Amity.Comment<any>) => {
          const { userObject } = await getAmityUser(item.userId);
          let formattedUserObject: UserInterface;

          formattedUserObject = {
            userId: userObject.data.userId,
            displayName: userObject.data.displayName,
            avatarFileId: userObject.data.avatarFileId,
          };

          return {
            commentId: item.commentId,
            data: item.data as Record<string, any>,
            dataType: item.dataType,
            myReactions: item.myReactions as string[],
            reactions: item.reactions as Record<string, number>,
            user: formattedUserObject as UserInterface,
            updatedAt: item.updatedAt,
            editedAt: item.editedAt,
            createdAt: item.createdAt,
            childrenComment: item.children,
            referenceId: item.referenceId,
          };
        })
      );
      setCommentList([...formattedCommentList]);
    }
  }, []);
  const getReplyComments = useCallback(async () => {
    const replyComments = await getCommentsDataByIds(childrenComment);
    formatComments(replyComments);
  }, [childrenComment, formatComments]);

  useEffect(() => {
    if (childrenComment.length > 0) {
      getReplyComments();
    }
  }, [childrenComment, getReplyComments]);

  const addReactionToComment: () => Promise<void> = async () => {
    if (isLike && likeReaction) {
      setLikeReaction(likeReaction - 1);
      setIsLike(false);
      const isRemoveComment = await removeCommentReaction(commentId, 'like');
      console.log('isRemovePost: ', isRemoveComment);
    } else {
      setIsLike(true);
      setLikeReaction(likeReaction + 1);
      const isLikeComment = await addCommentReaction(commentId, 'like');
      console.log('isLikeComment: ', isLikeComment);
    }
  };

  return (
    <View
      key={commentId}
      style={isReplyComment ? styles.replyCommentWrap : styles.commentWrap}
    >
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
                {!isLike && likeReaction === 0 ? 'Like' : likeReaction}
              </Text>
            </TouchableOpacity>
            {!isReplyComment && (
              <TouchableOpacity
                // onPress={() => addReactionToComment()}
                style={styles.likeBtn}
              >
                <SvgXml xml={replyIcon} width="20" height="16" />

                <Text style={styles.btnText}>Reply</Text>
              </TouchableOpacity>
            )}
          </View>
          {commentList.length > 0 && (
            <FlatList
              data={commentList}
              renderItem={({ item }) => (
                <CommentList commentDetail={item} isReplyComment />
              )}
              keyExtractor={(item) => item.commentId.toString()}
              onEndReachedThreshold={0.8}
            />
          )}
        </View>
      </View>
    </View>
  );
}
