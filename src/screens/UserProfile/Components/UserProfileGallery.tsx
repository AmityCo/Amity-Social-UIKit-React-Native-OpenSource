import { FlatList, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { FC, memo, useCallback, useState } from 'react';
import { useGallery } from '../../../hooks/useGallery';
import GalleryTab from './GalleryTab';
import { TabName } from '../../../enum/tabNameState';
import { useStyles } from '../styles';
import ImageView from '../../../components/react-native-image-viewing/dist';
import PlayIcon from '../../../svg/PlayIcon';
import PhotoIcon from '../../../svg/PhotoIcon';
import VideoIcon from '../../../svg/VideoIcon';

interface IUserProfileGallery {
  userId: string;
}

const UserProfileGallery: FC<IUserProfileGallery> = ({ userId }) => {
  const { images, videos } = useGallery(userId);
  const [showFullImage, setShowFullImage] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [tabName, setTabName] = useState<TabName>(TabName.Photos);
  const styles = useStyles();
  const data = tabName === TabName.Photos ? images : videos;

  const onPressThumbnail = useCallback((index) => {
    setImageIndex(index);
    setShowFullImage(true);
  }, []);

  const renderGalleryContent = useCallback(
    ({ item, index }) => {
      return (
        <TouchableOpacity onPress={() => onPressThumbnail(index)}>
          <Image source={{ uri: item.uri }} style={styles.thumbnail} />
          {item.dataType === 'video' && (
            <View style={styles.playButton}>
              <PlayIcon width={50} height={50} />
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [onPressThumbnail, styles.playButton, styles.thumbnail]
  );

  const renderGallery = useCallback(() => {
    if (!data || data?.length === 0) {
      const icon = tabName === TabName.Photos ? <PhotoIcon width={50} height={50} /> : <VideoIcon width={50} height={50} />;
      return (
        <View style={styles.emptyContentContainer}>
          {icon}
          <Text style={styles.emptyContentText}>No {tabName} yet</Text>
        </View>
      );
    }
    return (
      <FlatList
        scrollEnabled={false}
        data={data}
        renderItem={renderGalleryContent}
        keyExtractor={(item) => item}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    );
  }, [
    data,
    renderGalleryContent,
    styles.emptyContentContainer,
    styles.emptyContentText,
    tabName,
  ]);
  return (
    <View>
      <GalleryTab
        tabName={[TabName.Photos, TabName.Videos]}
        onTabChange={setTabName}
        curerntTab={tabName}
      />
      {renderGallery()}
      <ImageView
        images={data}
        imageIndex={imageIndex}
        visible={showFullImage}
        onRequestClose={() => setShowFullImage(false)}
        isVideoButton={data[imageIndex]?.dataType === 'video'}
        videoPosts={videos}
      />
    </View>
  );
};

export default memo(UserProfileGallery);
