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
  KeyboardAvoidingView,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { usePrevious, isNullOrWhitespace } from './helpers';
import {
  IUserStoryItem,
  NextOrPrevious,
  StoryListItemProps,
} from './interfaces';
import Video, { OnLoadData } from 'react-native-video';
import { SvgXml } from 'react-native-svg';
import {
  seenIcon,
  storyCircleCreatePlusIcon,
  storyCommentIcon,
  storyHyperLinkIcon,
  storyLikeIcon,
  storyLikedIcon,
  storyThreedotsMenu,
} from '../../../../svg/svg-xml-list';
import { useStyles } from './styles';
import { useTimeDifference } from '../../../../hooks/useTimeDifference';
import { useStory } from '../../../hook/useStory';
import { ElementID } from '../../../enum/enumUIKitID';
import useConfig from '../../../hook/useConfig';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../routes/RouteParamList';
import BottomSheet, { BottomSheetMethods } from '@devvie/bottom-sheet';
import { StoryRepository } from '@amityco/ts-sdk-react-native';
import CommentList from '../../Social/CommentList/CommentList';

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
  const { getConfig } = useConfig();
  const storyReactionBgColor =
    getConfig(ElementID.StoryReactionBtnOnStoryPage)?.background_color ??
    '#2b2b2b';
  const storyCommentBgColor =
    getConfig(ElementID.StoryCommentBtnOnStoryPage)?.background_color ??
    '#2b2b2b';
  const storyViewerBgColor =
    getConfig(ElementID.StoryImpressionBtnOnStoryPage)?.background_color ??
    '#2b2b2b';

  const storyPlusBgColor =
    getConfig(ElementID.CreateNewStoryBtnOnStoryPage)?.background_color ??
    '#ffffff';

  const [load, setLoad] = useState<boolean>(true);
  const [pressed, setPressed] = useState<boolean>(false);
  const [error, setError] = useState(false);
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
  const sheetRef = useRef<BottomSheetMethods>(null);
  const timeDifference = useTimeDifference(content[current]?.createdAt, true);
  const storyHyperLink = content[current]?.items[0]?.data || undefined;
  const creatorName = content[current]?.creatorName ?? '';
  const viewer = content[current]?.viewer ?? 0;
  const storyId = content[current]?.story_id;
  const reactionCounts = content[current]?.reactionCounts;
  const commentsCounts = content[current]?.commentsCounts;
  const myReactions = content[current]?.myReactions;
  const isOwner = content[current]?.isOwner;
  const navigation =
    useNavigation() as NativeStackNavigationProp<RootStackParamList>;
  const [totalReaction, setTotalReaction] = useState(reactionCounts);
  const [isLiked, setIsLiked] = useState<boolean>(myReactions?.length > 0);
  const [openCommentSheet, setOpenCommentSheet] = useState(false);
  const { handleReaction } = useStory();
  const prevCurrentPage = usePrevious(currentPage);

  useEffect(() => {
    const mappedStories = stories.map((x) => ({
      ...x,
      finish: 0,
    }));
    setContent(mappedStories);
  }, [stories]);

  useEffect(() => {
    setIsLiked(myReactions?.length > 0);
    setTotalReaction(reactionCounts);
  }, [myReactions, reactionCounts]);

  useEffect(() => {
    let isPrevious = !!prevCurrentPage && prevCurrentPage > currentPage;
    if (isPrevious) {
      setCurrent(content.length - 1);
    } else {
      setCurrent(0);
    }

    let data = [...content];
    data.map((storyItem, index) => {
      if (isPrevious) {
        storyItem.finish = 1;
        if (index === content.length - 1) {
          storyItem.finish = 0;
        }
      } else {
        storyItem.finish = 0;
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
          content[current - 1].story_image === content[current].story_image
        ) {
          start();
        } else if (
          current < prevCurrent &&
          content[current + 1].story_image === content[current].story_image
        ) {
          start();
        }
      }
    }
  }, [current]);

  const start = useCallback(() => {
    setLoad(false);
    startAnimation();
  }, []);

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
    content[current].markLinkAsClicked();
    const supported = await Linking.canOpenURL(storyHyperLink?.url);
    if (supported) {
      await Linking.openURL(storyHyperLink?.url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${storyHyperLink?.url}`);
    }
  }, [storyHyperLink?.url]);

  const onPressAvatar = useCallback(() => {
    onClosePress();
    navigation.navigate('Camera', {
      communityId: userId,
      communityName: profileName,
      communityAvatar: profileImage,
    });
  }, []);

  const onPressMenu = useCallback(() => {
    progress.stopAnimation(() => setPressed(true));
    setOpenCommentSheet(false);
    sheetRef.current?.open();
  }, []);

  const onPressComment = useCallback(() => {
    progress.stopAnimation(() => setPressed(true));
    setOpenCommentSheet(true);
    sheetRef.current?.open();
  }, []);

  const onCloseBottomSheet = useCallback(() => {
    startAnimation();
    setPressed(false);
  }, []);

  const deleteStory = useCallback(async () => {
    try {
      await StoryRepository.softDeleteStory(storyId);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Delete Story Error ', err.message);
    }
  }, []);

  const onPressDelete = useCallback(() => {
    Alert.alert(
      'Delete this story?',
      "This story will be permanently deleted. You'll no longer to see and find this story",
      [
        { text: 'Cancel' },
        { text: 'Delete', style: 'destructive', onPress: deleteStory },
      ]
    );
  }, []);

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
    <>
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
                muted={false}
              />
            ) : (
              <Image
                onError={({ nativeEvent: { error: err } }) =>
                  err && setError(true)
                }
                onLoadStart={() => setLoad(true)}
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
            {error && (
              <View style={styles.spinnerContainer}>
                <Text style={styles.error}>Story load error</Text>
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
                  style={[
                    styles.animationBackground,
                    unloadedAnimationBarStyle,
                  ]}
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
              <TouchableOpacity onPress={onPressAvatar} hitSlop={10}>
                <Image
                  style={[styles.avatarImage, storyAvatarImageStyle]}
                  source={{ uri: profileImage }}
                />
                <SvgXml
                  height={12}
                  width={12}
                  style={styles.storyCreateIcon}
                  xml={storyCircleCreatePlusIcon(storyPlusBgColor)}
                />
              </TouchableOpacity>
              {typeof renderTextComponent === 'function' ? (
                renderTextComponent({
                  item: content[current],
                  profileName,
                })
              ) : (
                <View>
                  <Text style={styles.avatarText}>{profileName}</Text>
                  <View style={styles.flexRowCenter}>
                    <Text style={[styles.avatarSubText, { marginLeft: 10 }]}>
                      {timeDifference} .{' '}
                    </Text>
                    <Text style={styles.avatarSubText}>By {creatorName}</Text>
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
                <View style={styles.menuCloseContaier}>
                  {isOwner && (
                    <TouchableOpacity
                      hitSlop={5}
                      style={styles.threeDotsMenu}
                      onPress={onPressMenu}
                    >
                      <SvgXml
                        xml={storyThreedotsMenu()}
                        width="25"
                        height="25"
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    hitSlop={5}
                    onPress={() => {
                      if (onClosePress) {
                        onClosePress();
                      }
                    }}
                  >
                    <Text style={styles.whiteText}>X</Text>
                  </TouchableOpacity>
                </View>
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
          </View>
          {storyHyperLink && (
            <TouchableOpacity
              style={styles.hyperlinkContainer}
              onPress={onPressHyperLink}
            >
              <SvgXml xml={storyHyperLinkIcon('blue')} width="25" height="25" />
              <Text style={styles.hyperlinkText}>
                {storyHyperLink.customText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {typeof renderSwipeUpComponent === 'function' ? (
          renderSwipeUpComponent({
            onPress: onSwipeUp,
            item: content[current],
          })
        ) : (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.seenContainer,
                { backgroundColor: storyViewerBgColor },
              ]}
            >
              <SvgXml xml={seenIcon()} width="25" height="25" />
              <Text style={styles.seen}>{viewer}</Text>
            </TouchableOpacity>
            <View style={styles.seenContainer}>
              <TouchableOpacity
                style={[
                  styles.iconContainer,
                  { backgroundColor: storyCommentBgColor },
                ]}
                onPress={onPressComment}
              >
                <SvgXml xml={storyCommentIcon()} width="25" height="25" />
                <Text style={styles.seen}>{commentsCounts}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: storyReactionBgColor,
                  },
                ]}
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

      {openCommentSheet ? (
        <BottomSheet
          style={styles.bottomSheet}
          ref={sheetRef}
          onClose={onCloseBottomSheet}
          disableKeyboardHandling
          height={'90%'}
          closeOnDragDown
        >
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={180}
            style={styles.commentBottomSheet}
          >
            <Text style={styles.commentTitle}>Comments</Text>
            <View style={styles.horizontalSperator} />
            <CommentList postId={storyId} postType="story" />
          </KeyboardAvoidingView>
        </BottomSheet>
      ) : (
        <BottomSheet
          ref={sheetRef}
          onClose={onCloseBottomSheet}
          closeOnDragDown
          height={120}
        >
          <View style={styles.deleteBottomSheet}>
            <TouchableOpacity onPress={onPressDelete}>
              <Text style={styles.deleteStoryTxt}>Delete story</Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      )}
    </>
  );
};

export default StoryListItem;

StoryListItem.defaultProps = {
  duration: 10000,
};
