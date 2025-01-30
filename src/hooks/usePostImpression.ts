import { useCallback, useEffect, useState } from 'react';
import { ViewToken } from 'react-native';
import { IPost } from '../components/AmityPostContentComponent/AmityPostContentComponent';


export const usePostImpression = (postList: IPost[]) => {
  const [postViews, setPostViews] = useState<ViewToken[]>([]);

  const handleViewChange = useCallback(({ viewableItems }) => {
    setPostViews([...viewableItems]);
  }, []);

  useEffect(() => {
    if (postViews.length > 0) {
      for (const viewablePost of postViews) {
        if (viewablePost) {
          const post = postList.find(
            (post) => post.postId === viewablePost.item.postId
          );
          if (post) {
            post.analytics?.markAsViewed();
          }
        }
      }
    }
  }, [postViews, postList]);

  return {
    handleViewChange,
  };
};
