import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { RootStackParamList } from '../../routes/RouteParamList';
import AmityPostComposerPage from '../AmityPostComposerPage/AmityPostComposerPage';
import { AmityPostComposerMode } from '../../types/global.interface';


type ICreatePost = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;

const CreatePost: FC<ICreatePost> = ({ route }) => {
  const { community, targetId, targetType } = route.params;
  return (
    <AmityPostComposerPage
      mode={AmityPostComposerMode.CREATE}
      targetId={targetId}
      targetType={targetType}
      community={community}
    />
  );
};

export default CreatePost;
