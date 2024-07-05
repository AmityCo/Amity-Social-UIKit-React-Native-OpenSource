import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { RootStackParamList } from '../../routes/RouteParamList';
import AmityPostComposerPage from '../../PublicApi/Pages/AmityPostComposerPage/AmityPostComposerPage';
import { AmityPostComposerMode } from '../../PublicApi/types';

type IEditPost = NativeStackScreenProps<RootStackParamList, 'EditPost'>;

const EditPost: FC<IEditPost> = ({ route }) => {
  const { community, post } = route.params;
  return (
    <AmityPostComposerPage
      mode={AmityPostComposerMode.EDIT}
      post={post}
      community={community}
    />
  );
};

export default EditPost;
