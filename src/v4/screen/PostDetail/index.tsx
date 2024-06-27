import React from 'react';
import AmityPostDetailPage from '../../PublicApi/Pages/AmityPostDetailPage/AmityPostDetailPage';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../routes/RouteParamList';

type IPostDetailPage = {
  route: RouteProp<RootStackParamList, 'PostDetail'>;
};

const PostDetail = ({ route }: IPostDetailPage) => {
  const { postId } = route.params;
  return <AmityPostDetailPage postId={postId} />;
};

export default PostDetail;
