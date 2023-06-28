import type {
  IPost,
  IVideoPost,
  MediaUri,
} from 'src/components/Social/PostList';
import type { IGroupChatObject, IUserObject } from '../components/ChatList';

export type RootStackParamList = {
  Home: undefined;
  SelectMembers: undefined;
  Second: undefined;
  ChatRoom: {
    channelId: string;
    chatReceiver?: IUserObject;
    groupChat?: IGroupChatObject;
  };
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
  RecentChat: undefined;
  ChatDetail: undefined;
  MemberDetail: undefined;
  EditChatDetail: undefined;
  Community: undefined;
  Explore: undefined;
  CategoryList: undefined;
  CreatePost: undefined;
  PostDetail: {
    postDetail: IPost;
    initVideoPosts?: IVideoPost[];
    initImagePosts?: string[];
    initVideoPostsFullSize?: MediaUri[];
    initImagePostsFullSize?: MediaUri[];
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
};
