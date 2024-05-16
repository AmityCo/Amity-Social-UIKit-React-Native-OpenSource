import { Image } from 'react-native';

const defaultAvatar = require('./icon/Placeholder.png');
const defaultCommunityAvatar = require('./icon/communityAvatar.png');

export const defaultAvatarUri = Image.resolveAssetSource(defaultAvatar).uri;
export const defaultCommunityAvatarUri = Image.resolveAssetSource(
  defaultCommunityAvatar
).uri;
