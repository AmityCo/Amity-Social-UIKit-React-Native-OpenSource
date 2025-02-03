import { Text, TouchableOpacity, View } from 'react-native';
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { useStyles } from './styles';
import { ComponentID, ElementID, PageID, TabName } from '../../enum';
import { CategoryRepository } from '@amityco/ts-sdk-react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../routes/RouteParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBehaviour } from '../../providers/BehaviourProvider';
import { useAmityComponent } from '../../hooks/useUiKitReference';
import AvatarElement from '../../Elements/CommonElements/AvatarElement';
import ImageElement from '../../Elements/CommonElements/ImageElement';
import TextElement from '../../Elements/CommonElements/TextElement';


type SearchResultItemType = {
  pageId?: PageID;
  componentId?: ComponentID;
  item: Amity.User & Amity.RawCommunity;
  searchType: TabName;
};

const SearchResultItem: FC<SearchResultItemType> = ({
  pageId = PageID.WildCardPage,
  componentId = ComponentID.WildCardComponent,
  item,
  searchType,
}) => {
  const { themeStyles } = useAmityComponent({
    pageId: pageId,
    componentId: componentId,
  });
  const styles = useStyles(themeStyles);

  const { AmityCommunitySearchResultComponent } = useBehaviour();
  const navigation =
    useNavigation() as NativeStackNavigationProp<RootStackParamList>;
  const [communityCategory, setCommunityCategory] =
    useState<Amity.Category>(null);
  const isCommunity = searchType === TabName.Communities;
  const showPrivateIcon = isCommunity && !item.isPublic;
  const showOfficialBadgeIcon = isCommunity && item.isOfficial;
  const memberText = item?.membersCount > 1 ? 'members' : 'member';

  const onPressSearchResultItem = useCallback(() => {

    if (searchType === TabName.Communities) {
      navigation.navigate('CommunityHome', {
        communityId: item.communityId,
        communityName: item.displayName,
      });
    } else {
      navigation.navigate('UserProfile', {
        userId: item.userId,
      });
    }
  }, [
    AmityCommunitySearchResultComponent,
    item.communityId,
    item.displayName,
    item.userId,
    navigation,
    searchType,
  ]);

  useEffect(() => {
    (async () => {
      if (isCommunity) {
        const { data } = await CategoryRepository.getCategory(
          item.categoryIds[0]
        );
        setCommunityCategory(data);
      }
    })();
  }, [isCommunity, item.categoryIds]);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPressSearchResultItem}
    >
      <AvatarElement
        style={styles.avatar}
        avatarId={item.avatarFileId}
        pageID={pageId}
        componentID={componentId}
        elementID={ElementID.community_avatar}
        targetType={searchType === TabName.Communities ? 'community' : 'user'}
      />
      <View style={styles.profileInfoContainer}>
        <View style={styles.rowContainer}>
          {showPrivateIcon && (
            <ImageElement
              pageID={pageId}
              componentID={componentId}
              elementID={ElementID.community_private_badge}
              style={styles.lockIcon}
              configKey="icon"
            />
          )}
          <TextElement
            pageID={pageId}
            componentID={componentId}
            elementID={ElementID.community_display_name}
            text={item.displayName}
            style={styles.diaplayName}
          />

          {showOfficialBadgeIcon && (
            <ImageElement
              pageID={pageId}
              componentID={componentId}
              elementID={ElementID.community_official_badge}
              style={styles.badgeIcon}
              configKey="icon"
            />
          )}
        </View>
        {isCommunity && (
          <>
            <Text
              style={communityCategory?.name && styles.category}
              testID="community_search_result/community_category_name"
              accessibilityLabel="community_search_result/community_category_name"
            >
              {communityCategory?.name ?? ''}
            </Text>
            <Text
              style={styles.memberCounts}
              testID="community_search_result/community_members_count"
              accessibilityLabel="community_search_result/community_members_count"
            >
              {`${item.membersCount} ${memberText}`}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(SearchResultItem);
