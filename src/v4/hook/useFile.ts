import { useCallback } from 'react';
import { FileRepository } from '@amityco/ts-sdk-react-native';
import { ImageSizeState, ImageSizeSubset } from '../enum/imageSizeState';

interface useFileProps {
  fileId: string;
  imageSize?: ImageSizeSubset;
}

export const useFile = () => {
  const getImage = useCallback(
    async ({ fileId, imageSize = ImageSizeState.medium }: useFileProps) => {
      if (!fileId) return undefined;
      const file = await FileRepository.getFile(fileId);
      if (!file) return undefined;
      const newImageUrl = FileRepository.fileUrlWithSize(
        file.data.fileUrl,
        imageSize
      );
      return newImageUrl;
    },
    []
  );
  return { getImage };
};
