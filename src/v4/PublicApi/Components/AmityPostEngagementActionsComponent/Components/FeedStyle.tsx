import { Text, TouchableOpacity, View } from 'react-native';
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { AmityPostEngagementActionsSubComponentType } from './type';
import {
  PostRepository,
  getPostTopic,
  subscribeTopic,
} from '@amityco/ts-sdk-react-native';
import { useStyles } from './styles';
import { useAmityComponent } from '../../../../hook';
import { PageID, ComponentID } from '../../../../enum';
import { SvgXml } from 'react-native-svg';
import {
  commentOvalWhite,
  likeReaction,
  likeReactionWhite,
  shareWihte,
} from '../../../../../svg/svg-xml-list';
import {
  addPostReaction,
  removePostReaction,
} from '../../../../../providers/Social/feed-sdk';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../routes/RouteParamList';

const FeedStyle: FC<AmityPostEngagementActionsSubComponentType> = ({
  postId,
}) => {
  const { themeStyles } = useAmityComponent({
    pageId: PageID.post_detail_page,
    componentId: ComponentID.post_content,
  });
  const styles = useStyles(themeStyles);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [postData, setPostData] = useState<Amity.Post>(null);
  const [isLike, setIsLike] = useState(false);
  const [totalReactions, setTotalReactions] = useState(0);
  useEffect(() => {
    let unsubscribe;
    PostRepository.getPost(postId, ({ error, loading, data }) => {
      if (!error && !loading) {
        unsubscribe = subscribeTopic(getPostTopic({ path: data.path }));
        setPostData(data);
        setTotalReactions(data.reactionsCount);
        setIsLike(data.myReactions.length > 0);
      }
    });
    return () => unsubscribe && unsubscribe();
  }, [postId]);

  const addReactionToPost = useCallback(async () => {
    try {
      if (isLike) {
        setIsLike(false);
        setTotalReactions((prev) => prev - 1);
        await removePostReaction(postData?.postId, 'like');
      } else {
        setIsLike(true);
        setTotalReactions((prev) => prev + 1);
        await addPostReaction(postData?.postId, 'like');
      }
    } catch (error) {
      console.log(error);
    }
  }, [isLike, postData?.postId]);

  const onPressComment = useCallback(() => {
    navigation.navigate('PostDetail', {
      postId: postId,
      postIndex: 1, //TODO change before push
    });
  }, [navigation, postId]);

  return (
    <View style={styles.feedActionSection}>
      <View style={styles.row}>
        <TouchableOpacity onPress={addReactionToPost} style={styles.likeBtn}>
          <SvgXml
            xml={
              isLike
                ? likeReaction(themeStyles.colors.background)
                : likeReactionWhite()
            }
            width="20"
            height="20"
          />
          <Text style={isLike ? styles.likedText : styles.btnText}>
            {totalReactions}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.commentBtn} onPress={onPressComment}>
          <SvgXml xml={commentOvalWhite()} width="20" height="20" />
          <Text style={styles.btnText}>{postData?.commentsCount}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.commentBtn}>
        <SvgXml xml={shareWihte()} width="20" height="20" />
        <Text style={styles.btnText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(FeedStyle);
