import {
  FlatList,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, memo, useCallback } from 'react';
import { useStyles } from './styles';

import { PageID, ComponentID, ElementID } from '../../enum';
import AvatarElement from '../../Elements/CommonElements/AvatarElement';
import TextElement from '../../Elements/CommonElements/TextElement';
import ImageElement from '../../Elements/CommonElements/ImageElement';
import CategoryElement from '../../Elements/CommonElements/CategoryElement';
import { useNavigation } from '@react-navigation/native';
import { useBehaviour } from '../../providers/BehaviourProvider';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/RouteParamList';
import { formatNumber } from '../../util/numberUtil';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import { useCommunities } from '../../hooks/useCommunities';
import { useAmityComponent } from '../../hooks/useUiKitReference';
type AmityMyCommunitiesComponentType = {
  pageId?: PageID;
  componentId?: ComponentID;
};

const AmityMyCommunitiesComponent: FC<AmityMyCommunitiesComponentType> = ({
  pageId = PageID.WildCardPage,
  componentId = ComponentID.WildCardComponent,
}) => {
  const { isExcluded, accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { AmityMyCommunitiesComponentBehaviour } = useBehaviour();
  const styles = useStyles(themeStyles);
  const { communities, onNextCommunityPage } = useCommunities();

  const myCommunitiesListItem = ({ item }: { item: Amity.Community }) => {
    const privateCommunityTextlength: TextStyle = !item.isPublic && {
      width: '90%',
    };
    const onPressCommunity = () => {
      if (AmityMyCommunitiesComponentBehaviour.onPressCommunity)
        return AmityMyCommunitiesComponentBehaviour.onPressCommunity();
      navigation.navigate('CommunityHome', {
        communityId: item.communityId,
        communityName: item.displayName,
      });
    };
    return (
      <TouchableOpacity
        style={styles.communityItemContainer}
        onPress={onPressCommunity}
      >
        <AvatarElement
          pageID={pageId}
          componentID={componentId}
          elementID={ElementID.community_avatar}
          avatarId={item.avatarFileId}
          style={styles.avatar}
          targetType="community"
        />
        <View style={styles.communityInfoContainer}>
          <View style={styles.communityNameContainer}>
            {!item.isPublic && (
              <ImageElement
                pageID={pageId}
                componentID={componentId}
                elementID={ElementID.community_private_badge}
                style={styles.privateBadge}
                configKey="icon"
              />
            )}
            <TextElement
              ellipsizeMode="tail"
              numberOfLines={1}
              pageID={pageId}
              componentID={componentId}
              elementID={ElementID.community_display_name}
              style={[styles.communityName, privateCommunityTextlength]}
              text={item.displayName}
            />
            {item.isOfficial && (
              <ImageElement
                pageID={pageId}
                componentID={componentId}
                elementID={ElementID.community_official_badge}
                style={styles.officialBadge}
                configKey="icon"
              />
            )}
          </View>
          <View style={styles.communityCategoryContainer}>
            {item.categoryIds.slice(0, 3).map((categoryId) => {
              return (
                <CategoryElement
                  style={styles.categoryName}
                  pageID={pageId}
                  componentID={componentId}
                  elementID={ElementID.community_category_name}
                  categoryId={categoryId}
                />
              );
            })}
            {item.categoryIds.length > 3 && (
              <Text style={styles.categoryName}>
                +{item.categoryIds.length - 3}
              </Text>
            )}
          </View>
          <TextElement
            style={styles.communityCount}
            pageID={pageId}
            componentID={componentId}
            elementID={ElementID.community_members_count}
            text={`${formatNumber(item.membersCount)} members`}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderContentLoading = useCallback(() => {
    return Array.from({ length: 6 }, (_, index) => {
      return (
        <View style={styles.skeletonLoadingContainer}>
          <ContentLoader
            key={index}
            height={70}
            speed={1}
            width={380}
            backgroundColor={themeStyles.colors.baseShade4}
            viewBox="-10 -10 380 70"
          >
            <Rect x="48" y="8" rx="3" ry="3" width="188" height="8" />
            <Rect x="48" y="26" rx="3" ry="3" width="152" height="8" />
            <Circle cx="20" cy="20" r="20" />
          </ContentLoader>
        </View>
      );
    });
  }, [styles.skeletonLoadingContainer, themeStyles]);

  if (isExcluded) return null;

  return (
    <View
      style={styles.container}
      testID={accessibilityId}
      accessibilityLabel={accessibilityId}
    >
      {communities?.length ? (
        <FlatList
          onEndReached={() => {
            onNextCommunityPage && onNextCommunityPage();
          }}
          data={communities}
          renderItem={myCommunitiesListItem}
          keyExtractor={(item, index) => item.communityId + index}
        />
      ) : (
        renderContentLoading()
      )}
    </View>
  );
};

export default memo(AmityMyCommunitiesComponent);
