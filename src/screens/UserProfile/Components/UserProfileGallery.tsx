import { FlatList, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { FC, memo, useCallback, useState } from 'react';
import { useGallery } from '../../../hooks/useGallery';
import GalleryTab from './GalleryTab';
import { TabName } from '../../../enum/tabNameState';
import { SvgXml } from 'react-native-svg';
import { photo, playBtn, video } from '../../../svg/svg-xml-list';
import { useStyles } from '../styles';
import ImageView from '../../../components/react-native-image-viewing/dist';

interface IUserProfileGallery {
  userId: string;
}

const UserProfileGallery: FC<IUserProfileGallery> = ({ userId }) => {
  const { images, videos, getNextPage } = useGallery(userId);
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
              <SvgXml xml={playBtn} width="50" height="50" />
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [onPressThumbnail, styles.playButton, styles.thumbnail]
  );

  const renderGallery = useCallback(() => {
    if (!data || data?.length === 0) {
      const icon = tabName === TabName.Photos ? photo() : video();
      return (
        <View style={styles.emptyContentContainer}>
          <SvgXml xml={icon} width={50} height={50} />
          <Text style={styles.emptyContentText}>No {tabName} yet</Text>
        </View>
      );
    }
    return (
      <FlatList
        onEndReached={() => {
          getNextPage && getNextPage();
        }}
        scrollEnabled={false}
        data={data}
        renderItem={renderGalleryContent}
        keyExtractor={(item) => item.uri}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    );
  }, [
    data,
    getNextPage,
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
