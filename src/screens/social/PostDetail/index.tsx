import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  FlatList,
} from 'react-native';
import { getCommentsByPostId } from '../../../providers/Social/comment-sdk';
import type { RootStackParamList } from 'src/routes/RouteParamList';
import PostList from '../../../components/Social/PostList';

import { styles } from './styles';
import type { IComment } from '../../../components/Social/CommentList';
import type { UserInterface } from '../../../types/user.interface';
import { getAmityUser } from '../../../providers/user-provider';
import CommentList from '../../../components/Social/CommentList';
type PostDetailScreenComponentType = React.FC<{
  route: RouteProp<RootStackParamList, 'PostDetail'>;
  navigation: StackNavigationProp<RootStackParamList, 'PostDetail'>;
}>;
const PostDetail: PostDetailScreenComponentType = ({ route }) => {
  const {
    postDetail,
    initImagePosts,
    initVideoPosts,
    initVideoPostsFullSize,
    initImagePostsFullSize,
  } = route.params;

  const [commentList, setCommentList] = useState<IComment[]>([]);
  console.log('commentList: ', commentList);

  const queryComment = useCallback(async () => {
    const { data: comments } = await getCommentsByPostId(postDetail.postId);
    if (comments.length > 0) {
      const formattedCommentList = await Promise.all(
        comments.map(async (item: Amity.Comment<any>) => {
          const { userObject } = await getAmityUser(item.userId);
          let formattedUserObject: UserInterface;

          formattedUserObject = {
            userId: userObject.data.userId,
            displayName: userObject.data.displayName,
            avatarFileId: userObject.data.avatarFileId,
          };

          return {
            commentId: item.commentId,
            data: item.data as Record<string, any>,
            dataType: item.dataType,
            myReactions: item.myReactions as string[],
            reactions: item.reactions as Record<string, number>,
            user: formattedUserObject as UserInterface,
            updatedAt: item.updatedAt,
            editedAt: item.editedAt,
            createdAt: item.createdAt,
            childrenComment: item.children,
          };
        })
      );
      setCommentList((prev) => [...prev, ...formattedCommentList]);
    }
  }, [postDetail.postId]);

  useEffect(() => {
    queryComment();
  }, [postDetail, queryComment]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 80, android: 80 })}
      style={styles.AllInputWrap}
    >
      <ScrollView style={styles.container}>
        <PostList
          postDetail={postDetail}
          initImagePosts={initImagePosts}
          initVideoPosts={initVideoPosts}
          initImagePostsFullSize={initImagePostsFullSize}
          initVideoPostsFullSize={initVideoPostsFullSize}
        />
        <View style={styles.commentListWrap}>
          <FlatList
            data={commentList}
            renderItem={({ item }) => <CommentList commentDetail={item} />}
            keyExtractor={(item) => item.commentId.toString()}
          />
        </View>
      </ScrollView>

      <View style={styles.InputWrap}>
        <TextInput style={styles.input} placeholder="Say something nice..." />
        <TouchableOpacity onPress={queryComment}>
          <Text style={styles.postDisabledBtn}> Post</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
export default PostDetail;
