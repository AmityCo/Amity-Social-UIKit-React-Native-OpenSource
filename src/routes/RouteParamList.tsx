export type RootStackParamList = {
  Home: { postIdCallBack?: string };
  AmitySocialUIKitV4Navigator: undefined;
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
    isBackEnabled?: boolean;
  };
  MemberDetail: undefined;
  Community: undefined;
  Explore: undefined;
  CategoryList: undefined;
  CreatePost: {
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
    postIndex?: number;
    isFromGlobalfeed?: boolean;
    // initVideoPosts?: IVideoPost[];
    // initImagePosts?: string[];
    // initVideoPostsFullSize?: MediaUri[];
    // initImagePostsFullSize?: MediaUri[];
  };
  UserProfile: {
    userId?: string;
    isBackEnabled?: boolean
  };
  MyUserProfile: undefined
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
  MyCommunity: undefined;
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
  AmitySocialGlobalSearchPage: undefined;
  Newsfeed: undefined;
  PreloadCommunityHome: undefined;
};
