import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { ComponentID, ElementID, PageID } from '../../../enum/enumUIKitID';
import { useAmityComponent } from '../../../hook';
import { useBehaviour } from '../../../providers/BehaviourProvider';
import ButtonWithIconElement from '../../Elements/ButtonWithIconElement/ButtonWithIconElement';

interface AmityCreatePostMenuComponentProps {
  pageId?: PageID;
  componentId?: ComponentID;
}

export const AmityCreatePostMenuComponent = ({
  pageId = PageID.WildCardPage,
  componentId = ComponentID.WildCardComponent,
}: AmityCreatePostMenuComponentProps): JSX.Element => {
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
    (postType: 'post' | 'story' | 'poll' | 'livestream') => {
      if (AmityCreatePostMenuComponentBehavior.goToSelectPostTargetPage) {
        return AmityCreatePostMenuComponentBehavior.goToSelectPostTargetPage({
          postType,
        });
      }

      return () => {
        //TODO: implement default behavior
      };
    },
    [AmityCreatePostMenuComponentBehavior]
  );

  return (
    <View style={styles.container}>
      <ButtonWithIconElement
        pageId={pageId}
        componentId={componentId}
        elementId={ElementID.create_post_button}
        onClick={() => onPressCreatePost('post')}
      />
      <ButtonWithIconElement
        pageId={pageId}
        componentId={componentId}
        elementId={ElementID.create_story_button}
        onClick={() => onPressCreatePost('story')}
      />
      <ButtonWithIconElement
        pageId={pageId}
        componentId={componentId}
        elementId={ElementID.create_poll_button}
        onClick={() => onPressCreatePost('poll')}
      />
      <ButtonWithIconElement
        pageId={pageId}
        componentId={componentId}
        elementId={ElementID.create_livestream_button}
        onClick={() => onPressCreatePost('livestream')}
      />
    </View>
  );
};
