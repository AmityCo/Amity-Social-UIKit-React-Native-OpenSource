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
  VideoPlayer: { source: string };
  PendingPosts: { communityId: string; isModerator: boolean };
};
