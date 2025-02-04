import { Text, TouchableOpacity, View } from 'react-native';
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { AmityPostEngagementActionsSubComponentType } from './type';
import {
  PostRepository,
  SubscriptionLevels,
  getPostTopic,
  subscribeTopic,
} from '@amityco/ts-sdk-react-native';
import { useStyles } from './styles';

import { PageID, ComponentID } from '../../../enum';

import {
  addPostReaction,
  removePostReaction,
} from '../../../providers/Social/feed-sdk';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/RouteParamList';
import LikeButtonIconElement from '../../../Elements/LikeButtonIconElement/LikeButtonIconElement';
import CommentButtonIconElement from '../../../Elements/CommentButtonIconElement/CommentButtonIconElement';
import { useAmityComponent } from '../../../hooks/useUiKitReference';

import LikeReactionIcon from '../../../svg/LikeReactionIcon';


const FeedStyle: FC<AmityPostEngagementActionsSubComponentType> = ({
  postId,
  pageId,
  componentId,
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
  const unsubscribeRef = useRef<() => void>(null);
  useEffect(() => {
    PostRepository.getPost(postId, ({ error, loading, data }) => {
      if (!error && !loading) {
        setPostData(data);
        setTotalReactions(data.reactionsCount);
        setIsLike(data.myReactions.length > 0);
      }
    });
    return () => unsubscribeRef?.current && unsubscribeRef?.current();
  }, [postId]);

  const addReactionToPost = useCallback(async () => {
    unsubscribeRef.current = subscribeTopic(
      getPostTopic(postData, SubscriptionLevels.POST)
    );
    try {
      if (isLike) {
        setIsLike(false);
        setTotalReactions((prev) => prev - 1);
        await removePostReaction(postId, 'like');
      } else {
        setIsLike(true);
        setTotalReactions((prev) => prev + 1);
        await addPostReaction(postId, 'like');
      }
    } catch (error) {
      console.log(error);
    }
  }, [isLike, postData, postId]);

  const onPressComment = useCallback(() => {
    navigation.navigate('PostDetail', {
      postId: postId,
    });
  }, [navigation, postId]);

  return (
    <View style={styles.actionSection}>
      <View style={styles.row}>
        <TouchableOpacity onPress={addReactionToPost} style={styles.likeBtn}>
          {isLike ? (
            // <SvgXml
            //   xml={likeReaction(themeStyles.colors.background)}
            //   width="20"
            //   height="20"
            // />

            <LikeReactionIcon circleColor={themeStyles.colors.background} width={20} height={20} />
          ) : (
            <LikeButtonIconElement
              pageID={pageId}
              componentID={componentId}
              width={20}
              height={20}
              resizeMode="contain"
            />
          )}
          <Text style={isLike ? styles.likedText : styles.btnText}>
            {totalReactions}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.commentBtn} onPress={onPressComment}>
          <CommentButtonIconElement
            pageID={pageId}
            componentID={componentId}
            width={20}
            height={20}
            resizeMode="contain"
          />
          <Text style={styles.btnText}>{postData?.commentsCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(FeedStyle);
