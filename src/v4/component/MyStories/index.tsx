import React, { memo, useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useStyles } from './styles';
import { useGlobalStory } from '../../hook/useGlobalStory';
import ContentLoader, { Circle } from 'react-content-loader/native';
import StoryCircleItem from './StoryCircleItem';
import Modal from 'react-native-modalbox';
import StoryTargetView from './StoryTargetView';

export interface IStoryItems {
  communityId: string;
  avatarFileId: string;
  displayName: string;
  isPublic: boolean;
  isOfficial: boolean;
  hasStories: boolean;
}

const MyStories = () => {
  const styles = useStyles();

  const { getGlobalStoryTargets, globalStoryTargets, loading } =
    useGlobalStory();
  const [currentCommunityIndex, setCurrentCommunityIndex] = useState(0);
  const [viewStory, setViewStory] = useState(false);
  useEffect(() => {
    getGlobalStoryTargets();
  }, [getGlobalStoryTargets]);

  const onPressStoryView = useCallback(
    (storyTarget: Amity.StoryTarget) => {
      setViewStory(true);
      const currentIndex = globalStoryTargets.findIndex(
        (target) => target.targetId === storyTarget.targetId
      );
      setCurrentCommunityIndex(currentIndex);
    },
    [globalStoryTargets]
  );

  if (loading) {
    return (
      <View style={styles.skeletonContainer}>
        {Array.from({ length: 6 }, (_, index) => {
          return (
            <View style={{ padding: 10 }} key={index}>
              <ContentLoader
                height={70}
                speed={1}
                width={70}
                backgroundColor={'#d2d2d2'}
                foregroundColor={'#eee'}
                viewBox="0 0 50 50"
              >
                <Circle cx="25" cy="25" r="25" />
              </ContentLoader>
            </View>
          );
        })}
      </View>
    );
  }
  if (globalStoryTargets && globalStoryTargets.length > 0) {
    return (
      <>
        <View style={styles.container}>
          <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
            {globalStoryTargets.map((storyTarget) => {
              return (
                <StoryCircleItem
                  onPressStoryView={onPressStoryView}
                  storyTarget={storyTarget}
                />
              );
            })}
          </ScrollView>
        </View>
        <Modal
          style={styles.modal}
          isOpen={viewStory}
          onClosed={() => setViewStory(false)}
          position="center"
          swipeToClose
          swipeArea={250}
          backButtonClose
          coverScreen={true}
          animationDuration={600}
        >
          <StoryTargetView
            currentCommunityIndex={currentCommunityIndex}
            setCurrentCommunityIndex={setCurrentCommunityIndex}
            globalStoryTargets={globalStoryTargets}
            setViewStory={setViewStory}
          />
        </Modal>
      </>
    );
  }

  return null;
};

export default memo(MyStories);
