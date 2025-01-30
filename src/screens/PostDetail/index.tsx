import React from 'react';

import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../routes/RouteParamList';
import AmityPostDetailPage from '../AmityPostDetailPage/AmityPostDetailPage';

type IPostDetailPage = {
  route: RouteProp<RootStackParamList, 'PostDetail'>;
};

const PostDetail = ({ route }: IPostDetailPage) => {
  const { postId } = route.params;
  return <AmityPostDetailPage postId={postId} />;
};

export default PostDetail;
