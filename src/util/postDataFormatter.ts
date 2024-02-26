import { getAmityUser } from '../providers/user-provider';
import { type IPost } from '../components/Social/PostList';
import { type UserInterface } from '../types/user.interface';

export const amityPostsFormatter = async (
  posts: Amity.Post<any>[]
): Promise<IPost[]> => {
  const formattedPostList = await Promise.all(
    posts.map(async (item: Amity.Post<any>) => {
      const { userObject } = await getAmityUser(item.postedUserId);
      return {
        postId: item.postId,
        data: item.data as Record<string, any>,
        dataType: item.dataType,
        myReactions: item.myReactions as string[],
        reactionCount: item.reactions as Record<string, number>,
        commentsCount: item.commentsCount,
        user: userObject.data as UserInterface,
        editedAt: item.editedAt,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        targetType: item.targetType,
        targetId: item.targetId,
        childrenPosts: item.children,
        mentionees: item.mentionees[0]?.userIds,
        mentionPosition: item?.metadata?.mentioned || undefined,
      } as IPost;
    })
  );
  return formattedPostList;
};
