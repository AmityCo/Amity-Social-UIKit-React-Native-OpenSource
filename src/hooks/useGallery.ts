import { PostRepository } from '@amityco/ts-sdk-react-native';
import { useCallback, useEffect, useState, useRef } from 'react';
import useAuth from './useAuth';

export const useGallery = (userId: string) => {
  const { apiRegion } = useAuth();
  const onNextPageRef = useRef<(() => void) | undefined | null>(null);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const getFile = useCallback(
    (fileId: string): string => {
      return `https://api.${apiRegion}.amity.co/api/v3/files/${fileId}/download?size=medium`;
    },
    [apiRegion]
  );
  useEffect(() => {
    const unsubscribe = PostRepository.getPosts(
      {
        targetId: userId,
        targetType: 'user',
        sortBy: 'lastCreated',
        feedType: 'published',
      },
      async ({ data, error, onNextPage, hasNextPage }) => {
        if (error) return null;
        onNextPageRef.current = hasNextPage ? onNextPage : null;
        const childredIds = data.flatMap((item) => item.children);
        const { data: postData } = await PostRepository.getPostByIds(
          childredIds
        );
        const response = postData.map((post) => {
          const uri =
            post.dataType === 'image'
              ? getFile(post.data.fileId)
              : post.dataType === 'video'
              ? getFile(post.data.thumbnailFileId)
              : null;
          return {
            dataType: post.dataType,
            ...post.data,
            uri,
          };
        });
        if (!response) return null;
        const categorizedData: {
          [key in 'image' | 'video' | 'poll']: any[];
        } = response.reduce(
          (acc, curr) => {
            if (!acc[curr.dataType]) {
              acc[curr.dataType] = [];
            }
            acc[curr.dataType].push(curr);
            return acc;
          },
          { image: [], video: [], poll: [] }
        );
        setImages(categorizedData.image);
        setVideos(categorizedData.video);
      }
    );
    return () => unsubscribe();
  }, [getFile, userId]);
  return {
    images,
    videos,
    getNextPage: onNextPageRef.current,
  };
};
