import { Image } from 'react-native';

const defaultAvatar = require('./icon/Placeholder.png');
const defaultCommunityAvatar = require('./icon/communityAvatar.png');
const defaultAdAvatar = require('./icon/adAvatar.png');

export const defaultAvatarUri = Image.resolveAssetSource(defaultAvatar).uri;
export const defaultCommunityAvatarUri = Image.resolveAssetSource(
  defaultCommunityAvatar
).uri;

export const defaultAdAvatarUri = Image.resolveAssetSource(defaultAdAvatar).uri;
