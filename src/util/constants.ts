export const MemberRoles = Object.freeze({
  MEMBER: 'member',
  MODERATOR: 'moderator',
  SUPER_MODERATOR: 'super-moderator',
  COMMUNITY_MODERATOR: 'community-moderator',
  CHANNEL_MODERATOR: 'channel-moderator',
});

export const Permissions = Object.freeze({
  EditUserPermission: 'EDIT_USER',
  BanUserPermission: 'BAN_USER',
  CreateRolePermission: 'CREATE_ROLE',
  EditRolePermission: 'EDIT_ROLE',
  DeleteRolePermission: 'DELETE_ROLE',
  AssignRolePermission: 'ASSIGN_USER_ROLE',
  EditChannelPermission: 'EDIT_CHANNEL',
  EditChannelRatelimitPermission: 'EDIT_CHANNEL_RATELIMIT',
  MuteChannelPermission: 'MUTE_CHANNEL',
  CloseChannelPermission: 'CLOSE_CHANNEL',
  AddChannelUserPermission: 'ADD_CHANNEL_USER',
  EditChannelUserPermission: 'EDIT_CHANNEL_USER',
  RemoveChannelUserPermission: 'REMOVE_CHANNEL_USER',
  MuteChannelUserPermission: 'MUTE_CHANNEL_USER',
  BanChannelUserPermission: 'BAN_CHANNEL_USER',
  EditMessagePermission: 'EDIT_MESSAGE',
  DeleteMessagePermission: 'DELETE_MESSAGE',
  EditCommunityPermission: 'EDIT_COMMUNITY',
  DeleteCommunityPermission: 'DELETE_COMMUNITY',
  AddChannelCommunityPermission: 'ADD_COMMUNITY_USER',
  EditChannelCommunityPermission: 'EDIT_COMMUNITY_USER',
  RemoveChannelCommunityPermission: 'REMOVE_COMMUNITY_USER',
  MuteChannelCommunityPermission: 'MUTE_COMMUNITY_USER',
  BanChannelCommunityPermission: 'BAN_COMMUNITY_USER',
  EditUserFeedPostPermission: 'EDIT_USER_FEED_POST',
  DeleteUserFeedPostPermission: 'DELETE_USER_FEED_POST',
  EditUserFeedCommentPermission: 'EDIT_USER_FEED_COMMENT',
  DeleteUserFeedCommentPermission: 'DELETE_USER_FEED_COMMENT',
  EditCommunityFeedPostPermission: 'EDIT_COMMUNITY_FEED_POST',
  DeleteCommunityFeedPostPermission: 'DELETE_COMMUNITY_FEED_POST',
  EditCommunityFeedCommentPermission: 'EDIT_COMMUNITY_FEED_COMMENT',
  DeleteCommunityFeedCommentPermission: 'DELETE_COMMUNITY_FEED_COMMENT',
  CreateCommunityCategoryPermission: 'CREATE_COMMUNITY_CATEGORY',
  EditCommunityCategoryPermission: 'EDIT_COMMUNITY_CATEGORY',
  DeleteCommunityCategoryPermission: 'DELETE_COMMUNITY_CATEGORY',
  ManageStoryPermission: 'MANAGE_COMMUNITY_STORY',
});
export const text_contain_blocked_word = 'Text contain blocked word';

export const ALLOWED_MEDIA_TYPE = {
  image: ['jpg', 'jpeg', 'png'],
  video: ['mp4', 'mov'],
};

export const STORY_DEFAULT_DURATION = 7000;
