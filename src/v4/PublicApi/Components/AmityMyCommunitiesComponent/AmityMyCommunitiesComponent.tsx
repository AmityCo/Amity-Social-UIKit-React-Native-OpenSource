import {
  FlatList,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, memo } from 'react';
import { useStyles } from './styles';
import { useCommunities } from '../../../hook/';
import useConfig from '../../../hook/useConfig';
import { PageID, ComponentID, ElementID } from '../../../enum';
import AvatarElement from '../../Elements/CommonElements/AvatarElement';
import TextElement from '../../Elements/CommonElements/TextElement';
import ImageElement from '../../Elements/CommonElements/ImageElement';
import CategoryElement from '../../Elements/CommonElements/CategoryElement';
import { useNavigation } from '@react-navigation/native';
import { useBehaviour } from '../../../providers/BehaviourProvider';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/RouteParamList';
import { formatNumber } from '../../../../util/numberUtil';
type AmityMyCommunitiesComponentType = {
  pageId?: PageID;
  componentId?: ComponentID;
};

const AmityMyCommunitiesComponent: FC<AmityMyCommunitiesComponentType> = ({
  pageId = PageID.WildCardPage,
  componentId = ComponentID.WildCardComponent,
}) => {
  const { excludes } = useConfig();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { AmityMyCommunitiesComponentBehaviour } = useBehaviour();
  const configId = `${pageId}/${componentId}/*`;
  const styles = useStyles();
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

  if (excludes.includes(configId)) return null;

  return (
    <View
      style={styles.container}
      testID={`${pageId}/${componentId}/*`}
      accessibilityLabel={`${pageId}/${componentId}/*`}
    >
      <FlatList
        onEndReached={onNextCommunityPage}
        data={communities}
        renderItem={myCommunitiesListItem}
        keyExtractor={(item) => item.communityId}
      />
    </View>
  );
};

export default memo(AmityMyCommunitiesComponent);
