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
  CommunityHome: undefined;
  MemberDetail: undefined;
  Community: undefined;
  Explore: undefined;
  CategoryList: undefined;
  CreatePost: undefined;
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
    userId: string;
    follow: string;
  };
  EditProfile: {
    userId: string;
  };
  EditCommunity: {
    communityId: string;
  };
  AllMyCommunity: undefined;
  CreateCommunity: undefined;
  PendingPosts: { communityId: string; isModerator: boolean };
};
