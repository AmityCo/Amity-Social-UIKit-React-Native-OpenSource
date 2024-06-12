import React, { memo, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { arrowForward } from '../../../../svg/svg-xml-list';
import { useStyles } from './styles';
import type { UserInterface } from '../../../../types/user.interface';
import { getCommunityById } from '../../../../providers/Social/communities-sdk';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../../../providers/amity-ui-kit-provider';
import MediaSection from '../../../../components/MediaSection';
import { IMentionPosition } from '../../../types/type';
import { RootStackParamList } from '../../../routes/RouteParamList';
import { ComponentID, ElementID, PageID } from '../../../enum';
import AvatarElement from '../../Elements/CommonElements/AvatarElement';
import { useAmityComponent } from '../../../hook';
import ModeratorBadgeElement from '../../Elements/ModeratorBadgeElement/ModeratorBadgeElement';
import AmityPostEngagementActionsComponent from '../AmityPostEngagementActionsComponent/AmityPostEngagementActionsComponent';
import { AmityPostContentComponentStyleEnum } from '../../../enum/AmityPostContentComponentStyle';
import { PostTargetType } from '../../../../enum/postTargetType';
import TimestampElement from '../../Elements/TimestampElement/TimestampElement';
import { LinkPreview } from '../../../component/PreviewLink';
import RenderTextWithMention from '../../../component/RenderTextWithMention/RenderTextWithMention';
export interface IPost {
  postId: string;
  data: Record<string, any>;
  dataType: string | undefined;
  myReactions: string[];
  reactionCount: Record<string, number>;
  commentsCount: number;
  user: UserInterface | undefined;
  updatedAt: string | undefined;
  editedAt: string | undefined;
  createdAt: string;
  targetType: PostTargetType;
  targetId: string;
  childrenPosts: string[];
  mentionees: string[];
  mentionPosition?: IMentionPosition[];
}
export interface IPostList {
  post: IPost;
  pageId?: PageID;
  AmityPostContentComponentStyle?: AmityPostContentComponentStyleEnum;
}
export interface MediaUri {
  uri: string;
}
export interface IVideoPost {
  thumbnailFileId: string;
  videoFileId: {
    original: string;
  };
}
const AmityPostContentComponent = ({
  pageId,
  post,
  AmityPostContentComponentStyle = AmityPostContentComponentStyleEnum.detail,
}: IPostList) => {
  const theme = useTheme() as MyMD3Theme;
  const componentId = ComponentID.post_content;
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId: pageId,
    componentId: componentId,
  });
  const styles = useStyles(themeStyles);
  const [textPost, setTextPost] = useState<string>('');
  const [communityData, setCommunityData] = useState<Amity.Community>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [mentionPositionArr, setMentionsPositionArr] = useState<
    IMentionPosition[]
  >([]);
  const {
    postId,
    data,
    myReactions = [],
    reactionCount,
    createdAt,
    user,
    targetType,
    targetId,
    childrenPosts = [],
    editedAt,
    mentionPosition,
  } = post ?? {};

  useEffect(() => {
    if (mentionPosition) {
      setMentionsPositionArr(mentionPosition);
    }
  }, [mentionPosition]);

  useEffect(() => {
    setTextPost(data?.text);
    if (targetType === 'community' && targetId) {
      getCommunityInfo(targetId);
    }
  }, [data?.text, myReactions, reactionCount?.like, targetId, targetType]);

  async function getCommunityInfo(id: string) {
    const { data: community }: { data: Amity.LiveObject<Amity.Community> } =
      await getCommunityById(id);
    if (community.error) return;
    if (!community.loading) {
      setCommunityData(community?.data);
    }
  }

  const handleDisplayNamePress = () => {
    if (user?.userId) {
      navigation.navigate('UserProfile', {
        userId: user?.userId,
      });
    }
  };

  const handleCommunityNamePress = () => {
    if (targetType === 'community' && targetId) {
      navigation.navigate('CommunityHome', {
        communityId: targetId,
        communityName: communityData?.displayName,
      });
    }
  };

  return (
    <View
      key={postId}
      style={styles.postWrap}
      testID={accessibilityId}
      accessibilityLabel={accessibilityId}
    >
      <View style={styles.headerSection}>
        <View style={styles.user}>
          <AvatarElement
            style={styles.avatar}
            avatarId={user?.avatarFileId}
            pageID={pageId}
            elementID={ElementID.WildCardElement}
            componentID={componentId}
          />

          <View style={styles.fillSpace}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={handleDisplayNamePress}>
                <Text style={styles.headerText}>{user?.displayName}</Text>
              </TouchableOpacity>

              {communityData?.displayName && (
                <View style={styles.communityNameContainer}>
                  <SvgXml
                    style={styles.arrow}
                    xml={arrowForward(theme.colors.baseShade1)}
                    width="8"
                    height="8"
                  />

                  <TouchableOpacity onPress={handleCommunityNamePress}>
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={3}
                      style={styles.headerText}
                    >
                      {communityData?.displayName}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.timeRow}>
              {targetType === 'community' && targetId && (
                <View style={styles.row}>
                  <ModeratorBadgeElement
                    pageID={pageId}
                    componentID={componentId}
                    communityId={targetType === 'community' && targetId}
                    userId={user?.userId}
                  />
                  <Text style={styles.dot}>·</Text>
                </View>
              )}
              <TimestampElement
                createdAt={createdAt}
                style={styles.headerTextTime}
                componentID={componentId}
              />

              {editedAt !== createdAt && (
                <>
                  <Text style={styles.dot}>·</Text>
                  <Text style={styles.headerTextTime}>Edited</Text>
                </>
              )}
            </View>
          </View>
        </View>
        <View style={styles.threeDots} />
      </View>
      <View>
        <View style={styles.bodySection}>
          {textPost && childrenPosts?.length === 0 && (
            <LinkPreview
              text={textPost}
              mentionPositionArr={[...mentionPositionArr]}
            />
          )}
          {textPost && childrenPosts?.length > 0 && (
            <RenderTextWithMention
              textPost={textPost}
              mentionPositionArr={[...mentionPositionArr]}
            />
          )}
          {childrenPosts?.length > 0 && (
            <MediaSection childrenPosts={childrenPosts} />
          )}
        </View>
        <AmityPostEngagementActionsComponent
          pageId={pageId}
          componentId={componentId}
          AmityPostContentComponentStyle={AmityPostContentComponentStyle}
          targetType={targetType}
          targetId={targetId}
          postId={postId}
        />
      </View>
    </View>
  );
};

export default memo(AmityPostContentComponent);
