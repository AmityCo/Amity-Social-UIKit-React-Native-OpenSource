export type User = {
  userId: string;
  avatar: string;
  displayName: string;
};
export type UserGroup = {
  title: string;
  data: Amity.User[];
};
export interface UserInterface {
  userId: string;
  displayName: string;
  avatarFileId: string;
}
