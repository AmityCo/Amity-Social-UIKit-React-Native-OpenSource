import {
  FeedRepository,
  PostContentType,
  PostRepository,
  ReactionRepository,
} from '@amityco/ts-sdk';

export interface IGlobalFeedRes {
  data: Amity.Post<any>[];
  nextPage: Amity.Page<number> | undefined;
  prevPage: Amity.Page<number> | undefined;
}

export async function getGlobalFeed(
  page: Amity.Page<number>
): Promise<IGlobalFeedRes> {
  const feedObject: Promise<IGlobalFeedRes> = new Promise(
    async (resolve, reject) => {
      try {
        const { data, nextPage, prevPage } =
          await FeedRepository.queryGlobalFeed({
            page,
          });
        resolve({ data, nextPage, prevPage });
      } catch (error) {
        reject(error);
      }
    }
  );
  return feedObject;
}

export async function addPostReaction(
  postId: string,
  reactionName: string
): Promise<boolean> {
  const reactionObject: Promise<boolean> = new Promise(
    async (resolve, reject) => {
      try {
        const isPostReactionAdded = await ReactionRepository.addReaction(
          'post',
          postId,
          reactionName
        );
        resolve(isPostReactionAdded);
      } catch (error) {
        reject(error);
      }
    }
  );
  return reactionObject;
}
export async function removePostReaction(
  postId: string,
  reactionName: string
): Promise<boolean> {
  const reactionObject: Promise<boolean> = new Promise(
    async (resolve, reject) => {
      try {
        const isPostReactionRemoved = await ReactionRepository.removeReaction(
          'post',
          postId,
          reactionName
        );
        resolve(isPostReactionRemoved);
      } catch (error) {
        reject(error);
      }
    }
  );
  return reactionObject;
}
export function getPostById(postId: string): Promise<any> {
  const communityObject = new Promise((resolve, reject) => {
    let object;
    const unsubscribe = PostRepository.getPost(
      postId,
      ({ data: postInfo, loading, error }) => {
        if (error) {
          reject(error);
        }
        if (!loading) {
          object = postInfo;
        }
      }
    );
    resolve({ data: object, unsubscribe });
  });
  return communityObject;
}
export async function createPostToFeed(
  targetType: string,
  targetId: string,
  content: { text: string; fileIds: string[] },
  postType: string
): Promise<Amity.Post<any>> {
  let postParam = {
    targetType: targetType,
    targetId: targetId,
  };
  if (postType === 'text') {
    const newPostParam = {
      data: {
        text: content.text,
      },
      ...postParam,
    };
    postParam = newPostParam;
  } else if (postType === 'image') {
    const formattedFileIds: { type: string; fileId: string }[] =
      content.fileIds.map((id) => {
        return { type: PostContentType.IMAGE, fileId: id };
      });
    const newPostParam = {
      data: {
        text: content.text,
      },
      attachments: formattedFileIds,
      ...postParam,
    };
    postParam = newPostParam;

  } else if (postType === 'video') {
    const formattedFileIds: { type: string; fileId: string }[] =
      content.fileIds.map((id) => {
        return { type: PostContentType.VIDEO, fileId: id };
      });
    const newPostParam = {
      data: {
        text: content.text,
      },
      attachments: formattedFileIds,
      ...postParam,
    };
    postParam = newPostParam;
  }
  console.log('postParam: ', postParam);
  const createPostObject: Promise<Amity.Post<any>> = new Promise(
    async (resolve, reject) => {
      try {
        const { data: post } = await PostRepository.createPost(postParam);
        resolve(post);
      } catch (error) {
        reject(error);
      }
    }
  );
  return createPostObject;
}
