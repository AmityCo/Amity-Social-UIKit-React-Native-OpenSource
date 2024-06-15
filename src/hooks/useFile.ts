import { useEffect, useState } from 'react';
import { FileRepository } from '@amityco/ts-sdk-react-native';
import { ImageSizeState, ImageSizeSubset } from '../enum/imageSizeState';

interface useFileProps {
  fileId: string;
  imageSize?: ImageSizeSubset;
}

const useFile = ({
  fileId,
  imageSize = ImageSizeState.medium,
}: useFileProps) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function run() {
      if (!fileId) return;
      const file = await FileRepository.getFile(fileId);
      if (!file) return;
      const newImageUrl = await FileRepository.fileUrlWithSize(
        file.data.fileUrl,
        imageSize
      );
      setImageUrl(newImageUrl);
    }
    run();
  }, [fileId, imageSize]);

  return imageUrl;
};

export default useFile;
