import { CommentRepository } from '@amityco/ts-sdk';

export interface ICommentRes {
  data: Amity.Comment<any>[];
  onNextPage: () => any;
  unsubscribe: () => any;
}

export async function getCommentsByPostId(
  postId: string
): Promise<ICommentRes> {
  return new Promise(async (resolve, reject) => {
    try {
      let commentsArr: Amity.Comment<any>[] = [];
      let onNextPageFunc: () => any;
      const unsubscribe = CommentRepository.getComments(
        {
          dataTypes: { matchType: 'any', values: ['text', 'image'] },
          referenceId: postId,
          referenceType: 'post',
        },
        ({ data: comments, onNextPage, loading, error }) => {

          if (error) reject(error);
          if (!loading) {
            commentsArr = comments;
            onNextPageFunc = onNextPage;
            resolve({
              data: commentsArr,
              onNextPage: onNextPageFunc,
              unsubscribe: () => unsubscribe,
            });
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}
