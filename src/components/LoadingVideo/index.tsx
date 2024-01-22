/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import { SvgXml } from 'react-native-svg';
import {
  deleteAmityFile,
  uploadVideoFile,
} from '../../providers/file-provider';
import { closeIcon, playBtn } from '../../svg/svg-xml-list';
import { createStyles } from './styles';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

interface OverlayImageProps {
  source: string;
  onClose?: (originalPath: string, fileId: string) => void;
  onLoadFinish?: (
    fileId: string,
    fileUrl: string,
    fileName: string,
    index: number,
    originalPath: string,
    thumbNail: string
  ) => void;
  index?: number;
  isUploaded: boolean;
  fileId?: string;
  thumbNail: string;
  onPlay?: (fileUrl: string) => void;
  isEditMode?: boolean;
}
const LoadingVideo = ({
  source,
  onClose,
  index,
  onLoadFinish,
  isUploaded = false,
  thumbNail,
  onPlay,
  fileId,
  isEditMode,
}: OverlayImageProps) => {
  const theme = useTheme() as MyMD3Theme;
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isProcess, setIsProcess] = useState<boolean>(false);
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
    const file: Amity.File<any>[] = await uploadVideoFile(
      source,
      (percent: number) => {
        setProgress(percent);
      }
    );
    if (file) {
      setIsProcess(false);
      handleLoadEnd();
      onLoadFinish &&
        onLoadFinish(
          file[0]?.fileId as string,
          file[0]?.fileUrl as string,
          file[0]?.attributes.name as string,
          index as number,
          source,
          thumbNail
        );
    }
  }, [source]);

  const handleDelete = async () => {
    if (fileId) {
      if (!isEditMode) {
        await deleteAmityFile(fileId as string);
      }
      onClose && onClose(source, fileId);
    }
  };
  useEffect(() => {
    if (isUploaded) {
      setLoading(false);
    } else {
      uploadFileToAmity();
    }
  }, [fileId, isUploaded, source]);
  const handleOnPlay = () => {
    onPlay && onPlay(source);
  };
  return (
    <View style={styles.container}>
      {!loading && (
        <TouchableOpacity style={styles.playButton} onPress={handleOnPlay}>
          <SvgXml xml={playBtn} width="50" height="50" />
        </TouchableOpacity>
      )}

      <Image
        source={{ uri: thumbNail }}
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
          <SvgXml xml={closeIcon(theme.colors.base)} width="12" height="12" />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default LoadingVideo;
