import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ComponentID, PageID } from '../../../enum/enumUIKitID';
import CreatePostButtonElement from '../../Elements/CreatePostButtonElement/CreatePostButtonElement';
import CreateStoryButtonElement from '../../Elements/CreateStoryButtonElement/CreateStoryButtonElement';

interface AmityCreatePostMenuComponentProps {
  pageId?: PageID | '*';
  componentId?: ComponentID | '*';
}

export const AmityCreatePostMenuComponent = ({
  pageId = '*',
  componentId = '*',
}: AmityCreatePostMenuComponentProps): JSX.Element => {
  const styles = StyleSheet.create({
    container: {
      paddingVertical: 12,
      width: 200,
      backgroundColor: 'white',
      borderRadius: 12,
    },
  });
  return (
    <View style={styles.container}>
      <CreatePostButtonElement
        pageId={pageId}
        componentId={componentId}
        onClick={() => {}}
      />
      <CreateStoryButtonElement
        pageId={pageId}
        componentId={componentId}
        onClick={() => {}}
      />
    </View>
  );
};
