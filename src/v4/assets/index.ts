import { Image } from 'react-native';

const defaultAvatar = require('./icon/Placeholder.png');

export const defaultAvatarUri = Image.resolveAssetSource(defaultAvatar).uri;
