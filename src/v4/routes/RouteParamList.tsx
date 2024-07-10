import { AmityPostComposerPageType } from '../PublicApi/types';
import { AmityPostTargetSelectionPageType } from '../enum';

export type RootStackParamList = {
  Home: { postIdCallBack?: string };
  AmitySocialGlobalSearchPage: undefined;
  AmityMyCommunitiesSearchPage: undefined;
  CommunitySearch: undefined;
  CommunityMemberDetail: {
    communityId: string;
  };
  CommunitySetting: {
    communityId: string;
    communityName: string;
  };
  CommunityList: {
    categoryId: string;
  };
  CommunityHome: {
    communityId: string;
    communityName: string;
  };
  MemberDetail: undefined;
  Community: undefined;
  Explore: undefined;
  CategoryList: undefined;
  CreatePost: AmityPostComposerPageType;
  EditPost: AmityPostComposerPageType;
  CreatePoll: {
    targetId: string;
    targetName: string;
    targetType: string;
    isPublic?: boolean;
    postSetting?: ValueOf<
      Readonly<{
        ONLY_ADMIN_CAN_POST: 'ONLY_ADMIN_CAN_POST';
        ADMIN_REVIEW_POST_REQUIRED: 'ADMIN_REVIEW_POST_REQUIRED';
        ANYONE_CAN_POST: 'ANYONE_CAN_POST';
      }>
    >;
    needApprovalOnPostCreation: boolean;
  };
  PostDetail: {
    postId: string;
  };
  UserProfile: {
    userId: string;
  };
  UserProfileSetting: {
    user: Amity.User;
    follow: string;
  };
  EditProfile: {
    user: Amity.User;
  };
  EditCommunity: {
    communityId: string;
  };
  AllMyCommunity: undefined;
  CreateCommunity: undefined;
  VideoPlayer: { source: string };
  PendingPosts: { communityId: string; isModerator: boolean };
  ReactionList: { referenceId: string; referenceType: string };
  CreateStory: {
    targetId: string;
    targetType: Amity.StoryTargetType;
  };
  UserPendingRequest: undefined;
  FollowerList: Amity.User;
  PostTargetSelection: { postType: AmityPostTargetSelectionPageType };
  StoryTargetSelection: undefined;
  CreateLivestream: {
    targetId: string;
    targetName: string;
    targetType: string;
  };
};
