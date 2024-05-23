import { Text, TouchableOpacity, View } from 'react-native';
import React, { FC, memo, useState, useCallback, useEffect } from 'react';
import {
  PostRepository,
  SubscriptionLevels,
  getPostTopic,
  subscribeTopic,
} from '@amityco/ts-sdk-react-native';
import { AmityPostEngagementActionsSubComponentType } from './type';
import { useStyles } from './styles';
import { useAmityComponent } from '../../../../hook';
import { PageID, ComponentID } from '../../../../enum';
import { SvgXml } from 'react-native-svg';
import { likeReaction } from '../../../../../svg/svg-xml-list';
import {
  addPostReaction,
  removePostReaction,
} from '../../../../../providers/Social/feed-sdk';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../routes/RouteParamList';
import LikeButtonIconElement from '../../../Elements/LikeButtonIconElement/LikeButtonIconElement';
import CommentButtonIconElement from '../../../Elements/CommentButtonIconElement/CommentButtonIconElement';
import ShareButtonIconElement from '../../../Elements/ShareButtonIconElement/ShareButtonIconElement';

const DetailStyle: FC<AmityPostEngagementActionsSubComponentType> = ({
  community,
  postId,
  componentId,
  pageId,
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
    let unsubscribe: () => void;
    PostRepository.getPost(postId, ({ error, loading, data }) => {
      if (!error && !loading) {
        unsubscribe = subscribeTopic(
          getPostTopic(data, SubscriptionLevels.POST)
        );
        setPostData(data);
        setTotalReactions(data.reactionsCount);
        setIsLike(data.myReactions.length > 0);
      }
    });
    return () => unsubscribe && unsubscribe();
  }, [postId]);

  const renderLikeText = useCallback(
    (likeNumber: number | undefined): string => {
      if (!likeNumber) return '';
      if (likeNumber === 1) return 'like';
      return 'likes';
    },
    []
  );
  const renderCommentText = useCallback(
    (commentNumber: number | undefined): string => {
      if (!commentNumber) return '';
      if (commentNumber === 1) return 'comment';
      return 'comments';
    },
    []
  );

  const addReactionToPost = useCallback(async () => {
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
  }, [isLike, postId]);

  const onClickReactions = useCallback(() => {
    navigation.navigate('ReactionList', {
      referenceId: postId,
      referenceType: 'post',
    });
  }, [navigation, postId]);

  if (community && !community.isJoined) {
    return (
      <View style={styles.actionSection}>
        <Text style={styles.btnText}>
          Join community to interact with all posts
        </Text>
      </View>
    );
  }

  return (
    <>
      {totalReactions === 0 && postData?.commentsCount === 0 ? null : (
        <View style={styles.countSection}>
          {totalReactions ? (
            <View style={styles.row}>
              <SvgXml
                style={{ marginRight: 4 }}
                xml={likeReaction(themeStyles.colors.background)}
                width="20"
                height="16"
              />
              <Text style={styles.likeCountText} onPress={onClickReactions}>
                {totalReactions} {renderLikeText(totalReactions)}
              </Text>
            </View>
          ) : (
            <Text />
          )}
          {postData?.commentsCount > 0 && (
            <Text style={styles.commentCountText}>
              {postData?.commentsCount > 0 && postData?.commentsCount}{' '}
              {renderCommentText(postData?.commentsCount)}
            </Text>
          )}
        </View>
      )}
      <></>
      <View style={[styles.actionSection, styles.detailActionSection]}>
        <View style={styles.row}>
          <TouchableOpacity onPress={addReactionToPost} style={styles.likeBtn}>
            {isLike ? (
              <SvgXml
                xml={likeReaction(themeStyles.colors.background)}
                width="20"
                height="16"
              />
            ) : (
              <LikeButtonIconElement
                pageID={pageId}
                componentID={componentId}
                width={20}
                height={20}
                resizeMode="contain"
              />
            )}

            <Text style={isLike ? styles.likedText : styles.btnText}>Like</Text>
          </TouchableOpacity>
          <View style={styles.commentBtn}>
            <CommentButtonIconElement
              pageID={pageId}
              componentID={componentId}
              width={20}
              height={20}
              resizeMode="contain"
            />
            <Text style={styles.btnText}>Comment</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.commentBtn}>
          <ShareButtonIconElement
            pageID={pageId}
            componentID={componentId}
            width={20}
            height={20}
            resizeMode="contain"
          />
          <Text style={styles.btnText}>Share</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default memo(DetailStyle);
