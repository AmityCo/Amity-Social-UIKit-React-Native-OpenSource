import { PostRepository } from '@amityco/ts-sdk-react-native';
import { useCallback, useEffect, useState, useRef } from 'react';
import useAuth from './useAuth';

type ElementOf<T> = T extends Array<infer U> ? U : never;

type TUseGallery = Partial<
  Pick<
    Parameters<typeof PostRepository.getPosts>[0],
    'targetId' | 'targetType' | 'limit'
  >
> & {
  dataType: ElementOf<
    Parameters<typeof PostRepository.getPosts>[0]['dataTypes']
  >;
};

export const useGallery = ({
  targetId,
  targetType,
  dataType,
  limit,
}: TUseGallery) => {
  const { apiRegion } = useAuth();
  const onNextPageRef = useRef<(() => void) | undefined | null>(null);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const getFile = useCallback(
    (fileId: string): string => {
      return `https://api.${apiRegion}.amity.co/api/v3/files/${fileId}/download?size=medium`;
    },
    [apiRegion]
  );
  useEffect(() => {
    const unsubscribe = PostRepository.getPosts(
      {
        targetId: targetId as string,
        targetType,
        dataTypes: [dataType],
        limit,
      },
      async ({ data, error, onNextPage, hasNextPage, loading }) => {
        if (error) return null;
        if (!loading) {
          onNextPageRef.current = hasNextPage ? onNextPage : null;
          const mappedMediaFiles = data.map((mediaData) => {
            const uri =
              dataType === 'image'
                ? getFile(mediaData.data.fileId)
                : dataType === 'video'
                ? getFile(mediaData.data.thumbnailFileId)
                : null;
            return {
              dataType,
              ...mediaData.data,
              uri,
            };
          });
          setMediaFiles(mappedMediaFiles);
        }
      }
    );

    return () => unsubscribe();
  }, [dataType, getFile, limit, targetId, targetType]);
  return {
    mediaFiles,
    getNextPage: onNextPageRef.current,
  };
};
