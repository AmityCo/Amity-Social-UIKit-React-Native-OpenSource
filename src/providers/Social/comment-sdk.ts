import {
  CommentRepository,
  ReactionRepository,
} from '@amityco/ts-sdk-react-native';
import { IMentionPosition } from '../../screens/CreatePost';

export interface ICommentRes {
  data: Amity.Comment[];
  onNextPage: () => any;
  unsubscribe: () => any;
  hasNextPage: boolean;
}

export async function addCommentReaction(
  commentId: string,
  reactionName: string
): Promise<boolean> {
  const reactionObject: Promise<boolean> = new Promise(
    async (resolve, reject) => {
      try {
        const isCommentReactionAdded = await ReactionRepository.addReaction(
          'comment',
          commentId,
          reactionName
        );
        resolve(isCommentReactionAdded);
      } catch (error) {
        reject(error);
      }
    }
  );
  return reactionObject;
}
export async function removeCommentReaction(
  commentId: string,
  reactionName: string
): Promise<boolean> {
  const reactionObject: Promise<boolean> = new Promise(
    async (resolve, reject) => {
      try {
        const isCommentReactionRemoved =
          await ReactionRepository.removeReaction(
            'comment',
            commentId,
            reactionName
          );
        resolve(isCommentReactionRemoved);
      } catch (error) {
        reject(error);
      }
    }
  );
  return reactionObject;
}
export async function createComment(
  text: string,
  postId: string,
  mentionUserIds: string[],
  mentionPosition: IMentionPosition[]
): Promise<Amity.InternalComment> {
  const createCommentObject: Promise<Amity.InternalComment> = new Promise(
    async (resolve, reject) => {
      try {
        const newComment = {
          data: {
            text: text,
          },
          referenceId: postId,
          referenceType: 'post' as Amity.CommentReferenceType,
          mentionees: [
            { type: 'user', userIds: mentionUserIds },
          ] as Amity.UserMention[],
          metadata: { mentioned: mentionPosition },
        };

        const { data: comment } = await CommentRepository.createComment(
          newComment
        );
        resolve(comment);
      } catch (error) {
        reject(error);
      }
    }
  );
  return createCommentObject;
}
export async function editComment(
  text: string,
  commentId: string
): Promise<Amity.InternalComment> {
  const createCommentObject: Promise<Amity.InternalComment> = new Promise(
    async (resolve, reject) => {
      try {
        const updatedComment = {
          data: {
            text: text,
          },
          referenceType: 'post' as Amity.CommentReferenceType,
        };
        const { data: comment } = await CommentRepository.updateComment(
          commentId,
          updatedComment
        );
        resolve(comment);
      } catch (error) {
        reject(error);
      }
    }
  );
  return createCommentObject;
}
export async function getCommentsDataByIds(
  commentIds: string[]
): Promise<Amity.InternalComment[]> {
  const commentObject: Promise<Amity.InternalComment[]> = new Promise(
    async (resolve, reject) => {
      try {
        const { data } = await CommentRepository.getCommentByIds(commentIds);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    }
  );
  return commentObject;
}
export async function deleteCommentById(commentId: string): Promise<boolean> {
  const isDeletedObject: Promise<boolean> = new Promise(
    async (resolve, reject) => {
      try {
        const hardDelete = await CommentRepository.deleteComment(
          commentId,
          true
        );
        if (hardDelete) {
          resolve(true);
        }
      } catch (error) {
        reject(error);
      }
    }
  );
  return isDeletedObject;
}
