import { TabName } from '../enum';

export interface IBehaviour {
  AmitySocialHomePageBehaviour?: {
    onChooseTab?: (arg?: string) => void;
  };
  AmitySocialHomeTopNavigationComponentBehaviour?: {
    goToGlobalSearchPage?: () => void;
    goToMyCommunitiesSearchPage?: () => void;
    onPressCreate?: () => void;
  };
  AmityCommunitySearchResultComponent?: {
    goToCommunityProfilePage?: (arg?: {
      targetId: string;
      targetType: TabName.Communities;
    }) => void;
    goToUserProfilePage?: (arg?: {
      targetId: string;
      targetType: TabName.Users;
    }) => void;
  };
  AmityEmptyNewsFeedComponent?: {
    onPressCreateCommunity?: () => void;
    onPressExploreCommunity?: () => void;
  };
  AmityMyCommunitiesComponentBehaviour?: {
    onPressCommunity?: (arg?: {
      communityId: string;
      communityName: string;
    }) => void;
  };
}
