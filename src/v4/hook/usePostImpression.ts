import { useCallback, useEffect, useState } from 'react';
import { ViewToken } from 'react-native';
import { IPost } from '../PublicApi/Components/AmityPostContentComponent/AmityPostContentComponent';
import { isAmityAd } from './useCustomRankingGlobalFeed';
import AdEngine from '../engine/AdEngine';

export const usePostImpression = (postList: (IPost | Amity.Ad)[]) => {
  const [postViews, setPostViews] = useState<ViewToken[]>([]);

  const handleViewChange = useCallback(({ viewableItems }) => {
    setPostViews([...viewableItems]);
  }, []);

  useEffect(() => {
    if (postViews.length > 0) {
      for (const viewablePost of postViews) {
        if (viewablePost) {
          const post = postList.find((post) =>
            isAmityAd(post)
              ? post.adId === viewablePost.item.adId
              : post.postId === viewablePost.item.postId
          );
          if (post && isAmityAd(post)) {
            AdEngine.instance.markSeen(post, 'feed' as Amity.AdPlacement);
          }

          if (post && !isAmityAd(post)) {
            post.analytics.markAsViewed();
          }
        }
      }
    }
  }, [postViews, postList]);

  return {
    handleViewChange,
  };
};
