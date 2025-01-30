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
  AmityGlobalFeedComponentBehavior?: {
    goToPostDetailPage?: (arg?: string) => void;
  };
  AmityPostContentComponentBehavior?: {
    goToCommunityProfilePage?: (arg?: {
      communityId?: string;
      communityName?: string;
    }) => void;
    goToUserProfilePage?: (arg?: { userId?: string }) => void;
    goToPostComposerPage?: () => void;
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
  AmityCreatePostMenuComponentBehavior?: {
    goToSelectPostTargetPage?: (arg?: {
      postType: 'post' | 'story' | 'poll' | 'livestream';
    }) => void;
    goToSelectStoryTargetPage?: () => void;
  };
  AmityPostTargetSelectionPageBehavior?: {
    goToPostComposerPage?: (arg?: {
      community: Amity.Community;
      targetId: string;
      targetType: 'community' | 'user';
    }) => void;
    goToPollComposerPage?: (arg?: {
      targetId: string;
      targetType: 'community' | 'user';
      targetName?: string;
      postSetting?: ValueOf<
        Readonly<{
          ONLY_ADMIN_CAN_POST: 'ONLY_ADMIN_CAN_POST';
          ADMIN_REVIEW_POST_REQUIRED: 'ADMIN_REVIEW_POST_REQUIRED';
          ANYONE_CAN_POST: 'ANYONE_CAN_POST';
        }>
      >;
      needApprovalOnPostCreation?: boolean;
      isPublic?: boolean;
    }) => void;
    goToLivestreamComposerPage?: (arg?: {
      targetId: string;
      targetType: 'community' | 'user';
      targetName?: string;
      postSetting?: ValueOf<
        Readonly<{
          ONLY_ADMIN_CAN_POST: 'ONLY_ADMIN_CAN_POST';
          ADMIN_REVIEW_POST_REQUIRED: 'ADMIN_REVIEW_POST_REQUIRED';
          ANYONE_CAN_POST: 'ANYONE_CAN_POST';
        }>
      >;
      needApprovalOnPostCreation?: boolean;
      isPublic?: boolean;
    }) => void;
  };
  AmityStoryTargetSelectionPageBehavior?: {
    goToStoryComposerPage?: (arg?: {
      targetId: string;
      targetType: 'community' | 'user';
    }) => void;
  };
}
