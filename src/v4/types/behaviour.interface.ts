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
}
