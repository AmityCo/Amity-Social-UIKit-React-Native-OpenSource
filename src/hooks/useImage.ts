import { useEffect, useState } from 'react';
import { FileRepository } from '@amityco/ts-sdk-react-native';
import { ImageSizeState, ImageSizeSubset } from '../enum/imageSizeState';

interface UseImageProps {
  fileId: string;
  imageSize?: ImageSizeSubset;
}

const useImage = ({
  fileId,
  imageSize = ImageSizeState.medium,
}: UseImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (fileId == null) {
      setImageUrl(undefined);
      return;
    }

    async function run() {
      const file = await FileRepository.getFile(fileId);
      const newImageUrl = !file
        ? undefined
        : await FileRepository.fileUrlWithSize(file.data.fileUrl, imageSize);
      setImageUrl(newImageUrl);
    }
    run();
  }, [fileId, imageSize]);

  return imageUrl;
};

export default useImage;
