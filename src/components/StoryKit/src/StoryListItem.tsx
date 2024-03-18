/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Animated,
  Image,
  Text,
  TouchableOpacity,
  Linking,
  TouchableWithoutFeedback,
  ActivityIndicator,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { usePrevious, isNullOrWhitespace } from './helpers';
import {
  IUserStoryItem,
  NextOrPrevious,
  StoryListItemProps,
} from './interfaces';
import Video, { OnLoadData } from 'react-native-video';
import { useFocusEffect } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import {
  seenIcon,
  storyCommentIcon,
  storyHyperLinkIcon,
  storyLikeIcon,
  storyLikedIcon,
} from '../../../svg/svg-xml-list';
import { useStyles } from './styles';
import { useTimeDifference } from '../../../hooks/useTimeDifference';
import { useStory } from '../../../hooks/useStory';
import { StoryRepository } from '@amityco/ts-sdk-react-native';
export const StoryListItem = ({
  index,
  key,
  userId,
  profileImage,
  profileName,
  duration,
  onFinish,
  onClosePress,
  stories,
  currentPage,
  onStorySeen,
  renderCloseComponent,
  renderSwipeUpComponent,
  renderTextComponent,
  loadedAnimationBarStyle,
  unloadedAnimationBarStyle,
  animationBarContainerStyle,
  storyUserContainerStyle,
  storyImageStyle,
  storyAvatarImageStyle,
  storyContainerStyle,
}: StoryListItemProps) => {
  const styles = useStyles();
  const [load, setLoad] = useState<boolean>(true);
  const [pressed, setPressed] = useState<boolean>(false);
  const [content, setContent] = useState<IUserStoryItem[]>(
    stories.map((x) => ({
      ...x,
      finish: 0,
    }))
  );

  const [current, setCurrent] = useState(0);
  const [storyDuration, setStoryDuration] = useState(duration);
  const [currentSeek, setCurrentSeek] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const timeDifference = useTimeDifference(content[current].createdAt, true);
  const storyHyperLink = content[current]?.items[0]?.data || undefined;
  const creatorName = content[current].creatorName ?? '';
  const viewer = content[current].viewer ?? 0;
  const comments = content[current].comments ?? [];
  const storyId = content[current].story_id;
  const [totalReaction, setTotalReaction] = useState(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const { handleReaction } = useStory();
  const prevCurrentPage = usePrevious(currentPage);
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = StoryRepository.getStoryByStoryId(
        storyId,
        ({ error, loading, data }) => {
          if (error) return;
          if (!loading) {
            const myReaction = data.myReactions ?? [];
            setIsLiked(myReaction.length > 0);
            setTotalReaction(data.reactionsCount);
          }
        }
      );
      return () => {
        setPressed(true);
        unsubscribe();
      };
    }, [storyId])
  );

  useEffect(() => {
    let isPrevious = !!prevCurrentPage && prevCurrentPage > currentPage;
    if (isPrevious) {
      setCurrent(content.length - 1);
    } else {
      setCurrent(0);
    }

    let data = [...content];
    data.map((x, i) => {
      if (isPrevious) {
        x.finish = 1;
        if (i == content.length - 1) {
          x.finish = 0;
        }
      } else {
        x.finish = 0;
      }
    });
    setContent(data);
    start();
  }, [currentPage]);

  const prevCurrent = usePrevious(current);

  useEffect(() => {
    if (!isNullOrWhitespace(prevCurrent)) {
      if (prevCurrent) {
        if (
          current > prevCurrent &&
          content[current - 1].story_image == content[current].story_image
        ) {
          start();
        } else if (
          current < prevCurrent &&
          content[current + 1].story_image == content[current].story_image
        ) {
          start();
        }
      }
    }
  }, [current]);

  function start() {
    setLoad(false);
    progress.setValue(0);
    startAnimation();
  }

  function startAnimation() {
    Animated.timing(progress, {
      toValue: 1,
      duration: storyDuration - currentSeek * 1000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        next();
      }
    });
  }

  function onSwipeUp(_props?: any) {
    if (onClosePress) {
      onClosePress();
    }
    if (content[current].onPress) {
      content[current].onPress?.();
    }
  }

  function onSwipeDown(_props?: any) {
    onClosePress();
  }

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  function next() {
    setCurrentSeek(0);
    // check if the next content is not empty
    setLoad(true);
    if (current !== content.length - 1) {
      let data = [...content];
      data[current].finish = 1;
      setContent(data);
      setCurrent(current + 1);
      progress.setValue(0);
    } else {
      // the next content is empty
      close('next');
    }
  }

  function previous() {
    setCurrentSeek(0);
    // checking if the previous content is not empty
    setLoad(true);
    if (current - 1 >= 0) {
      let data = [...content];
      data[current].finish = 0;
      setContent(data);
      setCurrent(current - 1);
      progress.setValue(0);
    } else {
      // the previous content is empty
      close('previous');
    }
  }

  function close(state: NextOrPrevious) {
    let data = [...content];
    data.map((x) => (x.finish = 0));
    setContent(data);
    progress.setValue(0);
    if (currentPage == index) {
      if (onFinish) {
        onFinish(state);
      }
    }
  }

  const onPressHyperLink = useCallback(async () => {
    const supported = await Linking.canOpenURL(storyHyperLink?.url);
    if (supported) {
      await Linking.openURL(storyHyperLink?.url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${storyHyperLink?.url}`);
    }
  }, [storyHyperLink?.url]);

  React.useEffect(() => {
    if (onStorySeen && currentPage === index) {
      onStorySeen({
        user_id: userId,
        user_image: profileImage,
        user_name: profileName,
        story: content[current],
      });
    }
  }, [currentPage, index, onStorySeen, current]);

  const handleLoadVideo = (data: OnLoadData) => {
    setStoryDuration(data.duration * 1000);
  };
  const onPressReaction = useCallback(() => {
    handleReaction({
      targetId: storyId,
      reactionName: 'like',
      isLiked,
    });
    setTotalReaction((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked((prev) => !prev);
  }, [storyId, isLiked]);

  return (
    <GestureRecognizer
      key={key}
      onSwipeUp={onSwipeUp}
      onSwipeDown={onSwipeDown}
      config={config}
      style={[styles.container, storyContainerStyle]}
    >
      <SafeAreaView>
        <View style={styles.backgroundContainer}>
          {content[current].story_type === 'video' ? (
            <Video
              onProgress={({ currentTime }) => setCurrentSeek(currentTime)}
              source={{ uri: content[current].story_video }}
              style={styles.video}
              resizeMode="contain"
              controls={false}
              onReadyForDisplay={() => start()}
              paused={
                content[current].story_page !== currentPage ? true : pressed
              }
              onLoad={handleLoadVideo}
            />
          ) : (
            <Image
              onLoadEnd={() => start()}
              source={{ uri: content[current].story_image }}
              style={[styles.image, storyImageStyle]}
              resizeMode="contain"
            />
          )}

          {load && (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="large" color={'white'} />
            </View>
          )}
        </View>
      </SafeAreaView>
      <View style={styles.flexCol}>
        <View
          style={[styles.animationBarContainer, animationBarContainerStyle]}
        >
          {content.map((_index, key) => {
            return (
              <View
                key={key}
                style={[styles.animationBackground, unloadedAnimationBarStyle]}
              >
                <Animated.View
                  style={[
                    {
                      flex: current == key ? progress : content[key].finish,
                      height: 2,
                      backgroundColor: 'white',
                    },
                    loadedAnimationBarStyle,
                  ]}
                />
              </View>
            );
          })}
        </View>
        <View style={[styles.userContainer, storyUserContainerStyle]}>
          <View style={styles.flexRowCenter}>
            <Image
              style={[styles.avatarImage, storyAvatarImageStyle]}
              source={{ uri: profileImage }}
            />
            {typeof renderTextComponent === 'function' ? (
              renderTextComponent({
                item: content[current],
                profileName,
              })
            ) : (
              <View>
                <Text style={styles.avatarText}>{profileName}</Text>
                <View style={styles.flexRowCenter}>
                  <Text style={styles.avatarText}>{timeDifference}</Text>
                  <Text style={styles.avatarText}>.</Text>
                  <Text style={styles.avatarText}>{creatorName}</Text>
                </View>
              </View>
            )}
          </View>
          <View style={styles.closeIconContainer}>
            {typeof renderCloseComponent === 'function' ? (
              renderCloseComponent({
                onPress: onClosePress,
                item: content[current],
              })
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (onClosePress) {
                    onClosePress();
                  }
                }}
              >
                <Text style={styles.whiteText}>X</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.pressContainer}>
          <TouchableWithoutFeedback
            onPressIn={() => progress.stopAnimation()}
            onLongPress={() => setPressed(true)}
            delayLongPress={300}
            onPressOut={() => {
              setPressed(false);
              startAnimation();
            }}
            onPress={() => {
              if (!pressed && !load) {
                previous();
              }
            }}
          >
            <View style={styles.flex} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPressIn={() => progress.stopAnimation()}
            onLongPress={() => setPressed(true)}
            delayLongPress={300}
            onPressOut={() => {
              setPressed(false);
              startAnimation();
            }}
            onPress={() => {
              if (!pressed && !load) {
                next();
              }
            }}
          >
            <View style={styles.flex} />
          </TouchableWithoutFeedback>
          {storyHyperLink && (
            <TouchableOpacity
              style={styles.hyperlinkContainer}
              onPress={onPressHyperLink}
            >
              <SvgXml xml={storyHyperLinkIcon('blue')} width="25" height="25" />
              <Text>{storyHyperLink.customText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {typeof renderSwipeUpComponent === 'function' ? (
        renderSwipeUpComponent({
          onPress: onSwipeUp,
          item: content[current],
        })
      ) : (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.seenContainer}>
            <SvgXml xml={seenIcon()} width="25" height="25" />
            <Text style={styles.seen}>{viewer}</Text>
          </TouchableOpacity>
          <View style={styles.seenContainer}>
            <TouchableOpacity style={styles.iconContainer}>
              <SvgXml xml={storyCommentIcon()} width="25" height="25" />
              <Text style={styles.seen}>{comments.length}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={onPressReaction}
            >
              <SvgXml
                xml={isLiked ? storyLikedIcon : storyLikeIcon}
                width="25"
                height="25"
              />
              <Text style={styles.seen}>{totalReaction}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </GestureRecognizer>
  );
};

export default StoryListItem;

StoryListItem.defaultProps = {
  duration: 10000,
};
