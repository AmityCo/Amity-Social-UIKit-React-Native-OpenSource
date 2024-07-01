import { FlatList, View } from 'react-native';
import React, {
  FC,
  useState,
  useRef,
  memo,
  useEffect,
  useCallback,
} from 'react';
import { UserInterface, IMentionPosition } from '../../../../types';
import { getAmityUser } from '../../../../providers/user-provider';
import { CommentRepository } from '@amityco/ts-sdk-react-native';
import CommentListItem from './CommentListItem/CommentListItem';
import { deleteCommentById } from '../../../../providers/Social/comment-sdk';
import { ComponentID, PageID } from '../../../enum';
import { useAmityComponent } from '../../../hook';

interface IComment {
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
  mentionees?: string[];
  mentionPosition?: IMentionPosition[];
  childrenNumber: number;
}

type AmityPostCommentComponentType = {
  pageId?: PageID;
  postId: string;
  postType: Amity.CommentReferenceType;
  disabledInteraction?: boolean;
  setReplyUserName?: (arg: string) => void;
  setReplyCommentId?: (arg: string) => void;
  ListHeaderComponent?: JSX.Element;
};

const AmityPostCommentComponent: FC<AmityPostCommentComponentType> = ({
  pageId = PageID.WildCardPage,
  postId,
  postType,
  disabledInteraction,
  setReplyUserName,
  setReplyCommentId,
  ListHeaderComponent,
}) => {
  const componentId = ComponentID.CommentTray;
  const { isExcluded } = useAmityComponent({ pageId, componentId });
  const onNextPageRef = useRef<() => void | null>(null);
  const [commentList, setCommentList] = useState<IComment[]>([]);
  useEffect(() => {
    if (!postId) return () => {};
    const unsubComment = CommentRepository.getComments(
      {
        dataTypes: { matchType: 'any', values: ['text', 'image'] },
        referenceId: postId,
        referenceType: postType,
        limit: 10,
      },
      async ({ error, loading, data, hasNextPage, onNextPage }) => {
        if (error) return;
        if (!loading) {
          data && data.length > 0 && (await queryComment(data));
          onNextPageRef.current = hasNextPage ? onNextPage : null;
        }
      }
    );
    return () => {
      setCommentList([]);
      unsubComment();
    };
  }, [postId, postType]);

  const queryComment = async (comments: Amity.InternalComment[]) => {
    const formattedCommentList = await Promise.all(
      comments.map(async (item: Amity.Comment) => {
        const { userObject } = await getAmityUser(item.userId);
        let formattedUserObject: UserInterface;

        formattedUserObject = {
          userId: userObject.data.userId,
          displayName: userObject.data.displayName,
          avatarFileId: userObject.data.avatarFileId,
        };

        return {
          targetType: item.targetType,
          targetId: item.targetId,
          commentId: item.commentId,
          data: item.data as Record<string, any>,
          dataType: item?.dataType || 'text',
          myReactions: item.myReactions as string[],
          reactions: item.reactions as Record<string, number>,
          user: formattedUserObject as UserInterface,
          updatedAt: item.updatedAt,
          editedAt: item.editedAt,
          createdAt: item.createdAt,
          childrenComment: item.children,
          childrenNumber: item.childrenNumber,
          referenceId: item.referenceId,
          mentionPosition: item?.metadata?.mentioned ?? [],
        };
      })
    );
    setCommentList([...formattedCommentList]);
  };

  const onDeleteComment = useCallback(
    async (commentId: string) => {
      const isDeleted = await deleteCommentById(commentId);
      if (isDeleted) {
        const prevCommentList: IComment[] = [...commentList];
        const updatedCommentList: IComment[] = prevCommentList.filter(
          (item) => item.commentId !== commentId
        );
        setCommentList(updatedCommentList);
      }
    },
    [commentList]
  );
  const handleClickReply = useCallback(
    (user: UserInterface, commentId: string) => {
      setReplyUserName(user.displayName);
      setReplyCommentId(commentId);
    },
    [setReplyCommentId, setReplyUserName]
  );
  if (isExcluded) return null;
  return (
    <View style={{ flex: 1, paddingBottom: 40 }}>
      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        keyboardShouldPersistTaps="handled"
        data={commentList}
        renderItem={({ item }) => {
          return (
            <CommentListItem
              onDelete={onDeleteComment}
              commentDetail={item}
              onClickReply={handleClickReply}
              postType={postType}
              disabledInteraction={disabledInteraction}
            />
          );
        }}
        keyExtractor={(item) => item.commentId}
        onEndReachedThreshold={0.8}
        onEndReached={() => {
          onNextPageRef.current && onNextPageRef.current();
        }}
      />
    </View>
  );
};

export default memo(AmityPostCommentComponent);
