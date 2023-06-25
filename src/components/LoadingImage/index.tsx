import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import { SvgXml } from 'react-native-svg';
import {
  deleteAmityFile,
  uploadImageFile,
} from '../../providers/file-provider';
import { closeIcon } from '../../svg/svg-xml-list';
import { createStyles } from './styles';

interface OverlayImageProps {
  source: string;
  onClose?: (index: number, originalPath: string) => void;
  onLoadFinish?: (
    fileId: string,
    fileUrl: string,
    fileName: string,
    index: number,
    originalPath: string
  ) => void;
  index?: number;
  isUploaded: boolean;
  fileId?: string;
}
const LoadingImage = ({
  source,
  onClose,
  index,
  onLoadFinish,
  isUploaded = false,
}: OverlayImageProps) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [fileId, setFileId] = useState<string>();
  const styles = createStyles();

  const handleLoadEnd = () => {
    setLoading(false);
  };
  useEffect(() => {
    if (progress === 100) {
      setIsProcess(true);
    }
  }, [progress]);

  const uploadFileToAmity = useCallback(async () => {
    const file: Amity.File<any>[] = await uploadImageFile(
      source,
      (percent: number) => {
        console.log('percent: ', percent);
        setProgress(percent);
      }
    );
    if (file) {
      setIsProcess(false);
      handleLoadEnd();
      setFileId(file[0]?.fileId);
      onLoadFinish &&
        onLoadFinish(
          file[0]?.fileId as string,
          (file[0]?.fileUrl + '?size=medium') as string,
          file[0]?.attributes.name as string,
          index as number,
          source
        );
      console.log('file: ', file);
    }
  }, [index, onLoadFinish, source]);

  const handleDelete = async () => {
    console.log('fileId: ', fileId);
    if (fileId) {
      const isDeleted = await deleteAmityFile(fileId as string);
      console.log('isDeleted: ', isDeleted);
      onClose && onClose(index as number, source);
    }
  };
  useEffect(() => {
    if (isUploaded) {
      setLoading(false);
      setFileId(fileId);
    } else {
      uploadFileToAmity();
    }
  }, [fileId, isUploaded, source, uploadFileToAmity]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: source }}
        style={[
          styles.image,
          loading ? styles.loadingImage : styles.loadedImage,
        ]}
      />
      {loading && (
        <View style={styles.overlay}>
          {isProcess ? (
            <Progress.CircleSnail size={60} borderColor="transparent" />
          ) : (
            <Progress.Circle
              progress={progress / 100}
              size={60}
              borderColor="transparent"
              unfilledColor="#ffffff"
            />
          )}
        </View>
      )}
      {!loading && (
        <TouchableOpacity style={styles.closeButton} onPress={handleDelete}>
          <SvgXml xml={closeIcon} width="12" height="12" />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default LoadingImage;
