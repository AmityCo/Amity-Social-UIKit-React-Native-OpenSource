import React, { FC, memo } from 'react';
// import FloatingButton from '../../../component/FloatingButton';
import { useDispatch } from 'react-redux';


import { View } from 'react-native';
// import AmityStoryTabComponent from '../AmityStoryTabComponent/AmityStoryTabComponent';
// import { AmityStoryTabComponentEnum } from '../../types';


import { ComponentID, PageID } from '../../enum';
import useConfig from '../../hooks/useConfig';
import useAuth from '../../hooks/useAuth';
import AmityGlobalFeedComponent from '../AmityGlobalFeedComponent/AmityGlobalFeedComponent';
import uiSlice from '../../redux/slices/uiSlice';

type AmityNewsFeedComponentType = {
  pageId?: PageID;
};

const AmityNewsFeedComponent: FC<AmityNewsFeedComponentType> = ({
  pageId = PageID.WildCardPage,
}) => {
  const { client } = useAuth();
  const dispatch = useDispatch();
  const { excludes } = useConfig();
  const componentId = ComponentID.newsfeed_component;
  const uiReference = `${pageId}/${componentId}/*`;
  const { openPostTypeChoiceModal } = uiSlice.actions;
  const openModal = () => {
    dispatch(
      openPostTypeChoiceModal({
        userId: (client as Amity.Client).userId as string,
      })
    );
  };

  if (excludes.includes(uiReference)) return null;

  return (
    <View testID={uiReference} accessibilityLabel={uiReference}>
      {/* <AmityStoryTabComponent type={AmityStoryTabComponentEnum.globalFeed} /> */}
      <AmityGlobalFeedComponent pageId={pageId} />
      {/* <FloatingButton onPress={openModal} /> */}
    </View>
  );
};

export default memo(AmityNewsFeedComponent);
