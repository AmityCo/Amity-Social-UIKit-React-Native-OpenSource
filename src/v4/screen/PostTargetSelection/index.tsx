import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AmityPostTargetSelectionPage from '../../PublicApi/Pages/AmityPostTargetSelectionPage/AmityPostTargetSelectionPage';
import { RootStackParamList } from '../../routes/RouteParamList';

type IPostTargetSelection = NativeStackScreenProps<
  RootStackParamList,
  'PostTargetSelection'
>;

const PostTargetSelection = ({ route }: IPostTargetSelection) => {
  const { postType } = route.params;
  return <AmityPostTargetSelectionPage postType={postType} />;
};

export default PostTargetSelection;
