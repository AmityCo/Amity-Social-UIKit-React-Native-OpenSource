import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { ComponentID, PageID } from '../../../enum/enumUIKitID';
import CreatePostButtonElement from '../../Elements/CreatePostButtonElement/CreatePostButtonElement';
import CreateStoryButtonElement from '../../Elements/CreateStoryButtonElement/CreateStoryButtonElement';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '~/providers/amity-ui-kit-provider';
import { useAmityComponent } from '../../../hook';
import { useBehaviour } from '../../../providers/BehaviourProvider';

interface AmityCreatePostMenuComponentProps {
  pageId?: PageID;
  componentId?: ComponentID;
}

export const AmityCreatePostMenuComponent = ({
  pageId = PageID.WildCardPage,
  componentId = ComponentID.WildCardComponent,
}: AmityCreatePostMenuComponentProps): JSX.Element => {
  const theme = useTheme() as MyMD3Theme;
  const { themeStyles } = useAmityComponent({ pageId, componentId });

  const { AmityCreatePostMenuComponentBehavior } = useBehaviour();

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 12,
      width: 200,
      backgroundColor: themeStyles
        ? themeStyles.colors.background
        : theme.colors.background,
      borderRadius: 12,
    },
  });

  const onPressCreatePost = useCallback(
    (postType: 'post' | 'story') => {
      if (AmityCreatePostMenuComponentBehavior) {
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
      <CreatePostButtonElement
        pageId={pageId}
        componentId={componentId}
        onClick={() => onPressCreatePost('post')}
      />
      <CreateStoryButtonElement
        pageId={pageId}
        componentId={componentId}
        onClick={() => onPressCreatePost('story')}
      />
    </View>
  );
};
