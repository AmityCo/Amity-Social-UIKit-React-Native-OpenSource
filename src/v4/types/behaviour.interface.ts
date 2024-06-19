import { TabName } from '../enum';

export interface IBehaviour {
  AmitySocialHomePageBehaviour?: {
    onChooseTab?: (arg?: string) => void;
  };
  AmitySocialHomeTopNavigationComponentBehaviour?: {
    onPressSearch?: () => void;
    onPressCreate?: () => void;
  };
  AmityCommunitySearchResultComponent?: {
    onPressSearchResultItem?: (arg?: {
      targetId: string;
      targetType: TabName.Communities | TabName.Users;
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
  AmityCreatePostMenuComponentBehavior?: {
    goToSelectPostTargetPage?: () => void;
  };
}
