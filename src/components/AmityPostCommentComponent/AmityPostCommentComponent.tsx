import { FlatList, View } from 'react-native';
import React, {
  FC,
  useState,
  useRef,
  memo,
  useEffect,
  useCallback,
} from 'react';

import { getAmityUser } from '../../providers/user-provider';
import { CommentRepository } from '@amityco/ts-sdk-react-native';
import CommentListItem from './CommentListItem/CommentListItem';
import { deleteCommentById } from '../../providers/Social/comment-sdk';
import { ComponentID, PageID } from '../../enum';

import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import { useDispatch } from 'react-redux';
import uiSlice from '../../redux/slices/uiSlice';
import { UserInterface } from '../../types/user.interface';
import { IMentionPosition } from '../../types/type';
import { useAmityComponent } from '../../hooks';

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
  const { isExcluded, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });
  const dispatch = useDispatch();
  const { showToastMessage } = uiSlice.actions;
  const onNextPageRef = useRef<() => void | null>(null);
  const [commentList, setCommentList] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        if (error) {
          dispatch(showToastMessage({ toastMessage: "Couldn't load comment" }));
          return;
        }
        if (!loading) {
          data && data.length > 0 && (await queryComment(data));
          onNextPageRef.current = hasNextPage ? onNextPage : null;
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }
      }
    );
    return () => {
      setCommentList([]);
      unsubComment();
    };
  }, [dispatch, postId, postType, showToastMessage]);

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

  const renderCommentListItem = useCallback(
    ({ item }) => {
      if (isLoading) {
        return (
          <ContentLoader
            height={100}
            speed={1}
            width={300}
            backgroundColor={themeStyles.colors.baseShade4}
            foregroundColor={themeStyles.colors.baseShade2}
            viewBox="0 0 300 70"
          >
            <Circle cx="24" cy="24" r="12" />
            <Rect x="50" y="12" rx="5" ry="5" width={220} height={50} />
            <Rect x="50" y="74" rx="5" ry="5" width={150} height={8} />
          </ContentLoader>
        );
      }

      return (
        <CommentListItem
          onDelete={onDeleteComment}
          commentDetail={item}
          onClickReply={handleClickReply}
          postType={postType}
          disabledInteraction={disabledInteraction}
        />
      );
    },
    [
      disabledInteraction,
      handleClickReply,
      isLoading,
      onDeleteComment,
      postType,
      themeStyles.colors.baseShade2,
      themeStyles.colors.baseShade4,
    ]
  );

  if (isExcluded) return null;
  return (
    <View style={{ flex: 1, paddingBottom: 40 }}>
      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        keyboardShouldPersistTaps="handled"
        data={commentList}
        renderItem={renderCommentListItem}
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
