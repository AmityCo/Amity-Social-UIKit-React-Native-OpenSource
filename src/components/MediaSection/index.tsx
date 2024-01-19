import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { SvgXml } from 'react-native-svg';

import { getStyles } from './styles';
import useAuth from '../../hooks/useAuth';
import { IVideoPost, MediaUri } from '../Social/PostList';
import { getPostById } from '../../providers/Social/feed-sdk';
import { useSelector } from 'react-redux';
import ImageView from '../../components/react-native-image-viewing/dist';
import { RootState } from '../../redux/store';
import { playBtn } from '../../svg/svg-xml-list';

interface IMediaSection {
  childrenPosts: string[];
}
export default function MediaSection({ childrenPosts }: IMediaSection) {
  const { apiRegion } = useAuth();
  const [imagePosts, setImagePosts] = useState<string[]>([]);
  const [videoPosts, setVideoPosts] = useState<IVideoPost[]>([]);
  const [imagePostsFullSize, setImagePostsFullSize] = useState<MediaUri[]>([]);
  const [videoPostsFullSize, setVideoPostsFullSize] = useState<MediaUri[]>([]);
  const [visibleFullImage, setIsVisibleFullImage] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);

  const styles = getStyles();
  let imageStyle: StyleProp<ImageStyle> | StyleProp<ImageStyle>[] =
    styles.imageLargePost;
  let colStyle: StyleProp<ImageStyle> = styles.col2;
  const { currentPostdetail } = useSelector(
    (state: RootState) => state.postDetail
  );
  const { postList: postListGlobal } = useSelector(
    (state: RootState) => state.globalFeed
  );
  const { postList } = useSelector((state: RootState) => state.feed);

  useEffect(() => {
    setImagePostsFullSize([]);
    setVideoPostsFullSize([]);
    if (imagePosts.length > 0) {
      const updatedUrls: MediaUri[] = imagePosts.map((url: string) => {
        return {
          uri: url.replace('size=medium', 'size=large'),
        };
      });
      setImagePostsFullSize(updatedUrls);
    }
    if (videoPosts.length > 0) {
      const updatedUrls: MediaUri[] = videoPosts.map((item: IVideoPost) => {
        return {
          uri: `https://api.${apiRegion}.amity.co/api/v3/files/${item?.thumbnailFileId}/download?size=large`,
        };
      });
      setVideoPostsFullSize(updatedUrls);
    }
  }, [imagePosts, videoPosts, apiRegion]);

  const getPostInfo = useCallback(async () => {
    try {
      const response = await Promise.all(
        childrenPosts.map(async (id) => {
          const { data: post } = await getPostById(id);
          return { dataType: post.dataType, data: post.data };
        })
      );
      response.forEach((item) => {
        if (item.dataType === 'image') {
          const url: string = `https://api.${apiRegion}.amity.co/api/v3/files/${item?.data.fileId}/download?size=medium`;
          setImagePosts((prev) => {
            return !prev.includes(url) ? [...prev, url] : [...prev];
          });
        } else if (item.dataType === 'video') {
          setVideoPosts((prev) => {
            return !prev.includes(item.data) ? [...prev, item.data] : [...prev];
          });
        }
      });
    } catch (error) {
      console.log('error: ', error);
    }
  }, [apiRegion, childrenPosts]);

  useEffect(() => {
    getPostInfo();
  }, [childrenPosts, currentPostdetail, postList, postListGlobal, getPostInfo]);

  function onClickImage(index: number): void {
    setIsVisibleFullImage(true);
    setImageIndex(index);
  }

  function renderMediaPosts() {
    const thumbnailFileIds: string[] =
      videoPosts.length > 0
        ? videoPosts.map((item) => {
            return `https://api.${apiRegion}.amity.co/api/v3/files/${item?.thumbnailFileId}/download?size=medium`;
          })
        : [];
    let mediaPosts: string[] = [];
    mediaPosts =
      [...imagePosts].length > 0 ? [...imagePosts] : [...thumbnailFileIds];
    const imageElement = mediaPosts.map((item: string, index: number) => {
      if (mediaPosts.length === 1) {
        imageStyle = styles.imageLargePost;
        colStyle = styles.col6;
      } else if (mediaPosts.length === 2) {
        colStyle = styles.col3;
        if (index === 0) {
          imageStyle = [styles.imageLargePost, styles.imageMarginRight];
        } else {
          imageStyle = [styles.imageLargePost, styles.imageMarginLeft];
        }
      } else if (mediaPosts.length === 3) {
        switch (index) {
          case 0:
            colStyle = styles.col6;
            imageStyle = [styles.imageMediumPost, styles.imageMarginBottom];
            break;
          case 1:
            colStyle = styles.col3;
            imageStyle = [
              styles.imageMediumPost,
              styles.imageMarginTop,
              styles.imageMarginRight,
            ];
            break;
          case 2:
            colStyle = styles.col3;
            imageStyle = [
              styles.imageMediumPost,
              styles.imageMarginTop,
              styles.imageMarginLeft,
            ];
            break;

          default:
            break;
        }
      } else {
        switch (index) {
          case 0:
            colStyle = styles.col6;
            imageStyle = [
              styles.imageMediumLargePost,
              styles.imageMarginBottom,
            ];
            break;
          case 1:
            colStyle = styles.col2;
            imageStyle = [
              styles.imageSmallPost,
              styles.imageMarginTop,
              styles.imageMarginRight,
            ];
            break;
          case 2:
            colStyle = styles.col2;
            imageStyle = [
              styles.imageSmallPost,
              styles.imageMarginTop,
              styles.imageMarginLeft,
              styles.imageMarginRight,
            ];
            break;
          case 3:
            colStyle = styles.col2;
            imageStyle = [
              styles.imageSmallPost,
              styles.imageMarginTop,
              styles.imageMarginLeft,
            ];
            break;
          default:
            break;
        }
      }

      return (
        <View style={colStyle} key={item}>
          <TouchableWithoutFeedback onPress={() => onClickImage(index)}>
            <View>
              {videoPosts.length > 0 && renderPlayButton()}
              <Image
                style={imageStyle}
                source={{
                  uri: item,
                }}
              />
              {index === 3 && imagePosts.length > 4 && (
                <View style={styles.overlay}>
                  <Text style={styles.overlayText}>{`+ ${
                    imagePosts.length - 3
                  }`}</Text>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    });
    if (imageElement.length < 3) {
      return (
        <View style={styles.imagesWrap}>
          <View style={styles.row}>{imageElement}</View>
        </View>
      );
    } else if (imageElement.length === 3) {
      return (
        <View style={[styles.imagesWrap]}>
          <View style={styles.row}>{imageElement.slice(0, 1)}</View>
          <View style={styles.row}>{imageElement.slice(1, 3)}</View>
        </View>
      );
    } else {
      return (
        <View style={styles.imagesWrap}>
          <View style={styles.row}>{imageElement.slice(0, 1)}</View>
          <View style={styles.row}>{imageElement.slice(1, 4)}</View>
        </View>
      );
    }
  }

  function renderPlayButton() {
    return (
      <View style={styles.playButton}>
        <SvgXml xml={playBtn} width="50" height="50" />
      </View>
    );
  }

  return (
    <View>
      {renderMediaPosts()}
      <ImageView
        images={
          imagePostsFullSize.length > 0
            ? imagePostsFullSize
            : videoPostsFullSize
        }
        imageIndex={imageIndex}
        visible={visibleFullImage}
        onRequestClose={() => setIsVisibleFullImage(false)}
        isVideoButton={videoPosts.length > 0 ? true : false}
        videoPosts={videoPosts}
      />
    </View>
  );
}
