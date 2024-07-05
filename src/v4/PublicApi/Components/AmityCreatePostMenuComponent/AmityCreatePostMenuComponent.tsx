import React, { useCallback, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ComponentID, ElementID, PageID } from '../../../enum/enumUIKitID';
import { useAmityComponent } from '../../../hook';
import { useBehaviour } from '../../../providers/BehaviourProvider';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../v4/routes/RouteParamList';
import ButtonWithIconElement from '../../Elements/ButtonWithIconElement/ButtonWithIconElement';
import { AmityPostTargetSelectionPageType } from '../../../enum';

interface AmityCreatePostMenuComponentProps {
  pageId?: PageID;
  componentId?: ComponentID;
}

const AmityCreatePostMenuComponent = ({
  pageId = PageID.WildCardPage,
  componentId = ComponentID.WildCardComponent,
}: AmityCreatePostMenuComponentProps): JSX.Element => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { themeStyles } = useAmityComponent({ pageId, componentId });

  const { AmityCreatePostMenuComponentBehavior } = useBehaviour();

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 12,
      width: 200,
      backgroundColor: themeStyles.colors.background,
      borderRadius: 12,
    },
  });

  const onPressCreatePost = useCallback(
    (postType: AmityPostTargetSelectionPageType) => {
      if (postType !== AmityPostTargetSelectionPageType.story) {
        if (AmityCreatePostMenuComponentBehavior.goToSelectPostTargetPage) {
          return AmityCreatePostMenuComponentBehavior.goToSelectPostTargetPage({
            postType,
          });
        }

        return navigation.navigate('PostTargetSelection', {
          postType,
        });
      }

      if (AmityCreatePostMenuComponentBehavior.goToSelectStoryTargetPage) {
        return AmityCreatePostMenuComponentBehavior.goToSelectStoryTargetPage();
      }

      navigation.navigate('StoryTargetSelection');
    },
    [AmityCreatePostMenuComponentBehavior, navigation]
  );

  return (
    <View style={styles.container}>
      <ButtonWithIconElement
        pageId={pageId}
        componentId={componentId}
        elementId={ElementID.create_post_button}
        onClick={() => onPressCreatePost(AmityPostTargetSelectionPageType.post)}
      />
      <ButtonWithIconElement
        pageId={pageId}
        componentId={componentId}
        elementId={ElementID.create_story_button}
        onClick={() =>
          onPressCreatePost(AmityPostTargetSelectionPageType.story)
        }
      />
      {/* <ButtonWithIconElement
        pageId={pageId}
        componentId={componentId}
        elementId={ElementID.create_poll_button}
        onClick={() => onPressCreatePost(AmityPostTargetSelectionPageType.poll)}
      />
      <ButtonWithIconElement
        pageId={pageId}
        componentId={componentId}
        elementId={ElementID.create_livestream_button}
        onClick={() =>
          onPressCreatePost(AmityPostTargetSelectionPageType.livestream)
        }
      /> */}
    </View>
  );
};

export default memo(AmityCreatePostMenuComponent);
