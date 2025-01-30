import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { RootStackParamList } from '../../routes/RouteParamList';
import { AmityPostComposerMode } from '../../types/global.interface';
import AmityPostComposerPage from '../AmityPostComposerPage/AmityPostComposerPage';


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
