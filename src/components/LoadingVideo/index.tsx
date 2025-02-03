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

import { Video, ResizeMode } from 'expo-av';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

interface OverlayImageProps {
  source: string;
  onClose?: (originalPath: string, fileId?: string) => void;
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

  fileId,
  isEditMode = false,
}: OverlayImageProps) => {
  const theme = useTheme() as MyMD3Theme;
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [thumbNailImage] = useState(thumbNail ?? '');
  const styles = createStyles();
  const [playingUri] = useState<string>('');
  const [isPause] = useState<boolean>(true);

  const videoRef = React.useRef(null);



  const handleLoadEnd = () => {
    setLoading(false);
  };

  const processThumbNail = async () => {
    // const thumbNail: Thumbnail = await createThumbnail({
    //   url: source,
    // });
    // setThumbNailImage(thumbNail.path);
  };
  useEffect(() => {
    processThumbNail();
  }, [thumbNail]);

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

  const handleOnPlay = async () => {
    // if (videoRef) {
    //   await videoRef.current.loadAsync({
    //     uri: `https://api.${apiRegion}.amity.co/api/v3/files/${videoPosts[currentImageIndex]?.videoFileId?.original}/download`,
    //   });

    //   await videoRef.current.presentFullscreenPlayer();
    //   await videoRef.current.playAsync();
    // }
  };

  return (
    <View style={styles.container}>
      {!loading && isPause && (
        <TouchableOpacity style={styles.playButton} onPress={handleOnPlay}>
          <SvgXml xml={playBtn} width="50" height="50" />
        </TouchableOpacity>
      )}
      {playingUri ? (
        <Video ref={videoRef} resizeMode={ResizeMode.CONTAIN} style={styles.image} />
      ) : thumbNailImage ? (
        <Image
          resizeMode="cover"
          source={{ uri: thumbNailImage }}
          style={[
            styles.image,
            loading ? styles.loadingImage : styles.loadedImage,
          ] as any}
        />
      ) : (
        <View style={styles.image} />
      )}

      {loading ? (
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
      ) : (
        <TouchableOpacity style={styles.closeButton} onPress={handleDelete}>
          <SvgXml xml={closeIcon(theme.colors.base)} width="12" height="12" />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default LoadingVideo;
