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
  RecentChat: undefined;
  ChatDetail: undefined;
  MemberDetail: undefined;
  EditChatDetail: undefined;
  Community: undefined;
  Explore: undefined;
  CategoryList: undefined;
};
