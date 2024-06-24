import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { FC, memo, useCallback, useRef, useState } from 'react';
import { useConfigImageUri, useStory } from '../../../../hook';
import { useStyles } from '../styles';
import Video, { OnLoadData } from 'react-native-video';
import {
  seenIcon,
  storyCircleCreatePlusIcon,
  storyCommentIcon,
  storyHyperLinkIcon,
  storyLikeIcon,
  storyLikedIcon,
  storyThreedotsMenu,
} from '../../../../../svg/svg-xml-list';
import { SvgXml } from 'react-native-svg';
import Modal from 'react-native-modalbox';
import { ComponentID, ElementID, PageID } from '../../../../enum';
import useConfig from '../../../../hook/useConfig';
import BottomSheet, { BottomSheetMethods } from '@devvie/bottom-sheet';
import CommentList from '../../../../component/Social/CommentList/CommentList';
import { StoryRepository } from '@amityco/ts-sdk-react-native';
import { NextOrPrevious } from '../../../../component/StoryKit';
import { useTimeDifference } from '../../../../../hooks/useTimeDifference';
import { STORY_DEFAULT_DURATION } from '../../../../../constants';
import GestureRecognizer from 'react-native-swipe-gestures';
import { useDispatch } from 'react-redux';
import uiSlice from '../../../../../redux/slices/uiSlice';
import { LoadingOverlay } from '../../../../../components/LoadingOverlay';
import Toast from '../../../../../components/Toast/Toast';

interface IAmityViewStoryItem {
  communityData: Amity.Community;
  communityAvatar: string;
  storyData: IStoryData[];
  hasStoryImpressionPermission: boolean;
  close: (state: NextOrPrevious) => void;
  onClose: () => void;
  setCurrent: (arg: number) => void;
  current: number;
  hasStoryPermission: boolean;
  onPressAvatar?: () => void;
  onPressCommunityName?: () => void;
}

interface IStoryData extends Amity.Story {
  finish: number;
}

const AmityViewStoryItem: FC<IAmityViewStoryItem> = ({
  communityAvatar,
  communityData,
  storyData,
  hasStoryImpressionPermission,
  close,
  onClose,
  setCurrent,
  current,
  hasStoryPermission,
  onPressAvatar,
  onPressCommunityName,
}) => {
  const styles = useStyles();
  const { getUiKitConfig } = useConfig();
  const progress = useRef(new Animated.Value(0)).current;
  const sheetRef = useRef<BottomSheetMethods>(null);
  const { handleReaction } = useStory();
  const currentStory = storyData[current];
  const storyHyperLink = currentStory?.items[0]?.data || undefined;
  const timeDifference = useTimeDifference(currentStory?.createdAt, true);
  const reachCount = currentStory?.reach ?? 0;
  const reactionsCounts = currentStory?.reactionsCount ?? 0;
  const commentsCounts = currentStory?.commentsCount ?? 0;
  const myReactions = currentStory?.myReactions;
  const [pressed, setPressed] = useState(false);
  const [muted, setMuted] = useState(false);
  const [storyDuration, setStoryDuration] = useState(STORY_DEFAULT_DURATION);
  const [currentSeek, setCurrentSeek] = useState(0);
  const [totalReaction, setTotalReaction] = useState(reactionsCounts);
  const [isLiked, setIsLiked] = useState<boolean>(myReactions?.length > 0);
  const [openCommentSheet, setOpenCommentSheet] = useState(false);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { showToastMessage } = uiSlice.actions;

  const storyViewerBgColor =
    (getUiKitConfig({
      page: PageID.StoryPage,
      component: ComponentID.WildCardComponent,
      element: ElementID.StoryImpressionBtn,
    })?.background_color as string) ?? '#2b2b2b';

  const storyCommentBgColor =
    (getUiKitConfig({
      page: PageID.StoryPage,
      component: ComponentID.WildCardComponent,
      element: ElementID.StoryCommentBtn,
    })?.background_color as string) ?? '#2b2b2b';

  const storyReactionBgColor =
    (getUiKitConfig({
      element: ElementID.StoryRing,
      component: ComponentID.WildCardComponent,
      page: PageID.StoryPage,
    })?.background_color as string) ?? '#2b2b2b';

  const storyPlusBgColor =
    (getUiKitConfig({
      page: PageID.StoryPage,
      component: ComponentID.WildCardComponent,
      element: ElementID.StoryHyperLinkBtn,
    })?.background_color as string) ?? '#ffffff';

  const muteIcon = useConfigImageUri({
    configPath: {
      page: PageID.StoryPage,
      component: ComponentID.WildCardComponent,
      element: ElementID.SpeakerBtn,
    },
    configKey: 'mute_icon',
  });
  const unmuteIcon = useConfigImageUri({
    configPath: {
      page: PageID.StoryPage,
      component: ComponentID.WildCardComponent,
      element: ElementID.SpeakerBtn,
    },
    configKey: 'unmute_icon',
  });

  const handleLoadVideo = (data: OnLoadData) => {
    setStoryDuration(data.duration * 1000);
  };

  const next = useCallback(() => {
    setCurrentSeek(0);
    setLoad(true);
    if (current !== storyData.length - 1) {
      let data = [...storyData];
      data[current].finish = 1;
      setCurrent(current + 1);
      progress.setValue(0);
    } else {
      close('next');
    }
  }, [close, current, progress, setCurrent, setLoad, storyData]);

  const startAnimation = useCallback(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: storyDuration - currentSeek * 1000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        next();
      }
    });
  }, [currentSeek, next, progress, storyDuration]);

  const start = useCallback(() => {
    setLoad(false);
    startAnimation();
  }, [setLoad, startAnimation]);

  const previous = useCallback(() => {
    setCurrentSeek(0);
    setLoad(true);
    if (current - 1 >= 0) {
      let data = [...storyData];
      data[current].finish = 0;
      setCurrent(current - 1);
      progress.setValue(0);
    } else {
      close('previous');
    }
  }, [close, current, progress, setCurrent, storyData]);

  const onPressComment = useCallback(() => {
    progress.stopAnimation(() => setPressed(true));
    return setOpenCommentSheet(true);
  }, [progress]);

  const onPressReaction = useCallback(() => {
    if (communityData?.isJoined) {
      handleReaction({
        targetId: currentStory?.storyId,
        reactionName: 'like',
        isLiked,
      });
      setTotalReaction((prev) => (isLiked ? prev - 1 : prev + 1));
      setIsLiked((prev) => !prev);
      return;
    }
    progress.stopAnimation(() => setPressed(true));
    Alert.alert('Join community to interact with all stories', null, [
      {
        text: 'OK',
        onPress: () => {
          startAnimation();
          setPressed(false);
        },
      },
    ]);
  }, [
    communityData?.isJoined,
    currentStory?.storyId,
    handleReaction,
    isLiked,
    progress,
    startAnimation,
  ]);

  const onCloseBottomSheet = useCallback(() => {
    startAnimation();
    setPressed(false);
  }, [startAnimation]);

  const onClosedCommentSheet = useCallback(() => {
    setOpenCommentSheet(false);
    startAnimation();
    setPressed(false);
  }, [startAnimation]);

  const deleteStory = useCallback(async () => {
    setLoading(true);
    try {
      current > 0 && previous();
      const deleted = await StoryRepository.softDeleteStory(
        currentStory?.storyId
      );
      if (deleted) {
        current === 0 && previous();
        dispatch(showToastMessage({ toastMessage: 'Story deleted' }));
      }
    } catch (err) {
      dispatch(showToastMessage({ toastMessage: 'Delete Story Error!' }));
    } finally {
      setLoading(false);
      sheetRef?.current?.close();
    }
  }, [current, currentStory?.storyId, dispatch, previous, showToastMessage]);

  const onPressDelete = useCallback(() => {
    Alert.alert(
      'Delete this story?',
      "This story will be permanently deleted. You'll no longer to see and find this story",
      [
        { text: 'Cancel', onPress: () => sheetRef?.current?.close() },
        { text: 'Delete', style: 'destructive', onPress: deleteStory },
      ]
    );
  }, [deleteStory]);

  const onPressHyperLink = useCallback(async () => {
    currentStory?.analytics.markLinkAsClicked();
    const hyperlinkUrl = storyHyperLink?.url?.includes('http')
      ? storyHyperLink?.url
      : `https://${storyHyperLink?.url}`;
    await Linking.openURL('https://google.com');
    const supported = await Linking.canOpenURL(hyperlinkUrl);
    if (supported) {
      await Linking.openURL(hyperlinkUrl);
    } else {
      Alert.alert(`Cannot open : ${hyperlinkUrl}`);
    }
  }, [currentStory?.analytics, storyHyperLink?.url]);

  const onPressMenu = useCallback(() => {
    progress.stopAnimation(() => setPressed(true));
    sheetRef.current?.open();
  }, [progress]);

  return (
    <View style={[styles.container]}>
      <SafeAreaView>
        <View style={styles.backgroundContainer}>
          {currentStory?.dataType === 'video' ? (
            <Video
              onLoadStart={() => setLoad(true)}
              onProgress={({ currentTime }) => setCurrentSeek(currentTime)}
              source={{ uri: currentStory?.videoData.fileUrl }}
              style={styles.video}
              resizeMode="contain"
              controls={false}
              onReadyForDisplay={() => start()}
              paused={pressed}
              onLoad={handleLoadVideo}
              muted={muted}
            />
          ) : currentStory?.dataType === 'image' ? (
            <Image
              onLoadStart={() => setLoad(true)}
              onError={({ nativeEvent: { error: err } }) =>
                err && setError(true)
              }
              onLoadEnd={() => start()}
              source={{ uri: currentStory?.imageData.fileUrl }}
              style={[styles.image]}
              resizeMode="contain"
            />
          ) : null}
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
      <GestureRecognizer onSwipeUp={onPressComment} style={styles.flexCol}>
        <View style={[styles.animationBarContainer]}>
          {storyData.map((story, index) => {
            return (
              <View key={story.storyId} style={[styles.animationBackground]}>
                <Animated.View
                  style={[
                    {
                      flex:
                        current === index ? progress : storyData[index].finish,
                      height: 2,
                      backgroundColor: 'white',
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
        <View style={[styles.userContainer]}>
          <View style={styles.flexRowCenter}>
            <TouchableOpacity
              onPress={() => {
                onPressAvatar && onPressAvatar();
              }}
              hitSlop={10}
            >
              <Image
                style={[styles.avatarImage]}
                source={{ uri: communityAvatar }}
              />
              {hasStoryPermission && (
                <SvgXml
                  height={12}
                  width={12}
                  style={styles.storyCreateIcon}
                  xml={storyCircleCreatePlusIcon(storyPlusBgColor)}
                />
              )}
            </TouchableOpacity>

            <View>
              <Text
                onPress={() => onPressCommunityName && onPressCommunityName()}
                style={styles.avatarText}
              >
                {communityData?.displayName}
              </Text>
              <View style={styles.flexRowCenter}>
                <Text style={[styles.avatarSubText, { marginLeft: 10 }]}>
                  {timeDifference} .{' '}
                </Text>
                <Text style={styles.avatarSubText}>
                  By {currentStory?.creator.displayName}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.closeIconContainer}>
            <View style={styles.menuCloseContaier}>
              {hasStoryPermission && (
                <TouchableOpacity
                  hitSlop={5}
                  style={styles.threeDotsMenu}
                  onPress={onPressMenu}
                >
                  <SvgXml xml={storyThreedotsMenu()} width="25" height="25" />
                </TouchableOpacity>
              )}
              <TouchableOpacity hitSlop={5} onPress={() => onClose()}>
                <Text style={styles.whiteText}>X</Text>
              </TouchableOpacity>
            </View>
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
              if (!pressed) {
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
              if (!pressed) {
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
              {storyHyperLink.customText ?? storyHyperLink.url}
            </Text>
          </TouchableOpacity>
        )}
        {currentStory?.dataType === 'video' && (
          <TouchableOpacity
            style={styles.muteBtn}
            onPress={() => setMuted((prev) => !prev)}
          >
            <Image
              source={muted ? muteIcon : unmuteIcon}
              style={styles.muteIcon}
            />
          </TouchableOpacity>
        )}
      </GestureRecognizer>
      <View style={styles.footer}>
        {hasStoryImpressionPermission ? (
          <TouchableOpacity
            style={[
              styles.seenContainer,
              { backgroundColor: storyViewerBgColor },
            ]}
          >
            <SvgXml xml={seenIcon()} width="25" height="25" />
            <Text style={styles.seen}>{reachCount}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.seenContainer} />
        )}
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
      {openCommentSheet && (
        <Modal
          style={styles.bottomSheet}
          isOpen={openCommentSheet}
          onClosed={onClosedCommentSheet}
          position="bottom"
          swipeToClose
          swipeArea={250}
          backButtonClose
          coverScreen={true}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.commentBottomSheet}
          >
            <View style={styles.handleBar} />
            <Text style={styles.commentTitle}>Comments</Text>

            <View style={styles.horizontalSperator} />
            <CommentList
              postId={currentStory?.storyId}
              postType="story"
              disabledInteraction={!communityData?.isJoined}
              onNavigate={onClose}
            />
          </KeyboardAvoidingView>
        </Modal>
      )}
      <BottomSheet
        ref={sheetRef}
        onClose={onCloseBottomSheet}
        closeOnDragDown
        height={120}
        style={styles.deleteBottomSheet}
      >
        <View style={styles.deleteBottomSheet}>
          <TouchableOpacity style={styles.deleteBtn} onPress={onPressDelete}>
            <Text style={styles.deleteStoryTxt}>Delete story</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
      <LoadingOverlay isLoading={loading} />
      <Toast />
    </View>
  );
};

export default memo(AmityViewStoryItem);
