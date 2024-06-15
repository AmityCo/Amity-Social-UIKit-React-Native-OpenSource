import { useCallback } from 'react';
import { FileRepository } from '@amityco/ts-sdk-react-native';
import { ImageSizeState, ImageSizeSubset } from '../enum/imageSizeState';
import { defaultAvatarUri } from '../assets/index';

interface useFileProps {
  fileId: string;
  imageSize?: ImageSizeSubset;
}

export const useFileV4 = () => {
  const getImage = useCallback(
    async ({ fileId, imageSize = ImageSizeState.medium }: useFileProps) => {
      if (!fileId) return defaultAvatarUri;
      const file = await FileRepository.getFile(fileId);
      if (!file) return defaultAvatarUri;
      const newImageUrl =
        FileRepository.fileUrlWithSize(file.data.fileUrl, imageSize) ??
        defaultAvatarUri;
      return newImageUrl;
    },
    []
  );
  return { getImage };
};
