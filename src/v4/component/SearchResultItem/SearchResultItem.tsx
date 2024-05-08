import { Image, Text, TouchableOpacity, View } from 'react-native';
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { useStyles } from './styles';
import { useConfigImageUri, useFile } from '../../hook';
import {
  ComponentID,
  ElementID,
  ImageSizeState,
  PageID,
  TabName,
} from '../../enum';
import { CategoryRepository } from '@amityco/ts-sdk-react-native';
import { defaultAvatarUri } from '../../assets/';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../routes/RouteParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBehaviour } from '../../providers/BehaviourProvider';

type SearchResultItemType = {
  item: Amity.User & Amity.RawCommunity;
  searchType: TabName;
};

const SearchResultItem: FC<SearchResultItemType> = ({ item, searchType }) => {
  const styles = useStyles();
  const { AmityCommunitySearchResultComponent } = useBehaviour();
  const navigation =
    useNavigation() as NativeStackNavigationProp<RootStackParamList>;
  const { getImage } = useFile();
  const lockIcon = useConfigImageUri({
    configKey: 'icon',
    configPath: {
      page: PageID.social_global_search_page,
      component: ComponentID.community_search_result,
      element: ElementID.community_private_badge,
    },
  });
  const officialBadge = useConfigImageUri({
    configKey: 'icon',
    configPath: {
      page: PageID.social_global_search_page,
      component: ComponentID.community_search_result,
      element: ElementID.community_official_badge,
    },
  });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [communityCategory, setCommunityCategory] =
    useState<Amity.Category>(null);

  const isCommunity = searchType === TabName.Communities;
  const showPrivateIcon = isCommunity && !item.isPublic;
  const showOfficialBadgeIcon = isCommunity && item.isOfficial;
  const memberText = item?.membersCount > 1 ? 'members' : 'member';

  const onPressSearchResultItem = useCallback(() => {
    if (AmityCommunitySearchResultComponent.onPressSearchResultItem)
      return AmityCommunitySearchResultComponent.onPressSearchResultItem({
        targetId: item.communityId ?? item.userId,
        targetType: searchType as TabName.Communities | TabName.Users,
      });
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
      const avatar = await getImage({
        fileId: item.avatarFileId,
        imageSize: ImageSizeState.small,
      });
      setAvatarUrl(avatar ?? defaultAvatarUri);
      if (isCommunity) {
        const { data } = await CategoryRepository.getCategory(
          item.categoryIds[0]
        );
        setCommunityCategory(data);
      }
    })();
  }, [getImage, isCommunity, item.avatarFileId, item.categoryIds]);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPressSearchResultItem}
    >
      {avatarUrl && (
        <Image
          source={{ uri: avatarUrl }}
          style={styles.avatar}
          testID="community_search_result/community_avatar"
          accessibilityLabel="community_search_result/community_avatar"
        />
      )}
      <View style={styles.profileInfoContainer}>
        <View style={styles.rowContainer}>
          <Text
            style={styles.diaplayName}
            testID="community_search_result/community_display_name"
            accessibilityLabel="community_search_result/community_display_name"
          >
            {item.displayName}
          </Text>
          {showPrivateIcon && (
            <Image
              source={officialBadge}
              style={styles.badgeIcon}
              testID="community_search_result/community_private_badge"
              accessibilityLabel="community_search_result/community_private_badge"
            />
          )}
          {showOfficialBadgeIcon && (
            <Image
              source={lockIcon}
              style={styles.lockIcon}
              testID="community_search_result/community_official_badge"
              accessibilityLabel="community_search_result/community_official_badge"
            />
          )}
        </View>
        {isCommunity && (
          <>
            <Text
              style={styles.category}
              testID="community_search_result/community_category_name"
              accessibilityLabel="community_search_result/community_category_name"
            >
              {communityCategory?.name ?? ''}
            </Text>
            <Text
              style={styles.category}
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
