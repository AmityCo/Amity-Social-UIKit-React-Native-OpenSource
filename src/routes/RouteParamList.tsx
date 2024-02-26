export type RootStackParamList = {
  Home: { postIdCallBack?: string };
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
  CreatePost: {
    targetId: string;
    targetName: string;
    targetType: string;
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
    postIndex: number;
    isFromGlobalfeed?: boolean;
    // initVideoPosts?: IVideoPost[];
    // initImagePosts?: string[];
    // initVideoPostsFullSize?: MediaUri[];
    // initImagePostsFullSize?: MediaUri[];
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
};
