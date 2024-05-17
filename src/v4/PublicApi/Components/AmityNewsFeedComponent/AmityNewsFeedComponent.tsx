import React, { FC } from 'react';
import GlobalFeed from '../../../screen/GlobalFeed';
import FloatingButton from '../../../component/FloatingButton';
import { useDispatch } from 'react-redux';
import uiSlice from '../../../../redux/slices/uiSlice';
import useAuth from '../../../../hooks/useAuth';
import { View } from 'react-native';
import AmityStoryTabComponent from '../AmityStoryTabComponent/AmityStoryTabComponent';
import { AmityStoryTabComponentEnum } from '../../types';
import useConfig from '../../../hook/useConfig';
import { ComponentID, PageID } from '../../../enum/enumUIKitID';

type AmityNewsFeedComponentType = {
  pageId: PageID;
};

const AmityNewsFeedComponent: FC<AmityNewsFeedComponentType> = ({
  pageId = '*',
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
      <AmityStoryTabComponent type={AmityStoryTabComponentEnum.globalFeed} />
      <GlobalFeed />
      <FloatingButton onPress={openModal} />
    </View>
  );
};

export default AmityNewsFeedComponent;
