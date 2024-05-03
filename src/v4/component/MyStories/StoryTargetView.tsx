import { Platform } from 'react-native';
import React, { FC, useCallback, useLayoutEffect, useRef } from 'react';
import AndroidCubeEffect from '../StoryKit/src/components/AndroidCubeEffect';
import CubeNavigationHorizontal from '../StoryKit/src/components/CubeNavigationHorizontal';
import AmityViewStoryPage from '../../PublicApi/Pages/AmityViewStoryPage/AmityViewStoryPage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/RouteParamList';
import { useStoryPermission } from '../../hook';
import { NextOrPrevious } from '../StoryKit';

interface IStorytargetView {
  currentCommunityIndex: number;
  setCurrentCommunityIndex: (arg: number) => void;
  globalStoryTargets: Amity.StoryTarget[];
  setViewStory: (arg: boolean) => void;
  onClose?: () => void;
}

const StoryTargetView: FC<IStorytargetView> = ({
  currentCommunityIndex,
  setCurrentCommunityIndex,
  globalStoryTargets,
  setViewStory,
  onClose,
}) => {
  const cube = useRef<CubeNavigationHorizontal | AndroidCubeEffect>();
  const communityId = globalStoryTargets[currentCommunityIndex].targetId;
  const hasStoryPermission = useStoryPermission(communityId);

  const navigation =
    useNavigation() as NativeStackNavigationProp<RootStackParamList>;
  useLayoutEffect(() => {
    cube && cube.current.scrollTo(currentCommunityIndex);
  }, [currentCommunityIndex]);

  cube && cube?.current?.scrollTo(currentCommunityIndex);

  const onPressCreateStory = useCallback(() => {
    hasStoryPermission &&
      navigation.navigate('CreateStory', {
        targetId: communityId,
        targetType: 'community',
      });
  }, [communityId, hasStoryPermission, navigation]);

  const onPressAvatar = useCallback(() => {
    setViewStory(false);
    onPressCreateStory();
  }, [onPressCreateStory, setViewStory]);

  const onPressCommunityName = useCallback(() => {
    setViewStory(false);
    navigation.navigate('CommunityHome', {
      communityId: communityId,
      communityName: '',
    });
  }, [communityId, navigation, setViewStory]);

  const onFinish = useCallback(
    (state?: NextOrPrevious) => {
      if (state === 'next') {
        if (currentCommunityIndex < globalStoryTargets.length - 1) {
          return setCurrentCommunityIndex(currentCommunityIndex + 1);
        }
        setViewStory(false);
        onClose && onClose();
        return;
      }
      if (state === 'previous') {
        if (currentCommunityIndex > 0)
          return setCurrentCommunityIndex(currentCommunityIndex - 1);
      }
      setViewStory(false);
      onClose && onClose();
    },
    [
      currentCommunityIndex,
      globalStoryTargets.length,
      onClose,
      setCurrentCommunityIndex,
      setViewStory,
    ]
  );

  if (Platform.OS === 'ios') {
    return (
      <CubeNavigationHorizontal
        ref={cube as React.LegacyRef<CubeNavigationHorizontal>}
        callBackAfterSwipe={(x: any) => {
          if (x !== currentCommunityIndex) {
            setCurrentCommunityIndex(parseInt(x, 10));
          }
        }}
      >
        {globalStoryTargets.map((storyTarget, i) => {
          return (
            <AmityViewStoryPage
              targetType={'community'}
              targetId={storyTarget.targetId}
              key={storyTarget.targetId}
              onFinish={onFinish}
              onPressAvatar={onPressAvatar}
              onPressCommunityName={onPressCommunityName}
              index={i}
              currentPage={currentCommunityIndex}
            />
          );
        })}
      </CubeNavigationHorizontal>
    );
  } else {
    return (
      <AndroidCubeEffect
        ref={cube as React.LegacyRef<AndroidCubeEffect>}
        callBackAfterSwipe={(x: any) => {
          if (x !== currentCommunityIndex) {
            setCurrentCommunityIndex(parseInt(x, 10));
          }
        }}
      >
        {globalStoryTargets.map((storyTarget, i) => {
          return (
            <AmityViewStoryPage
              targetType={'community'}
              targetId={storyTarget.targetId}
              key={storyTarget.targetId}
              onFinish={onFinish}
              onPressAvatar={onPressAvatar}
              onPressCommunityName={onPressCommunityName}
              index={i}
              currentPage={currentCommunityIndex}
            />
          );
        })}
      </AndroidCubeEffect>
    );
  }
};

export default StoryTargetView;
