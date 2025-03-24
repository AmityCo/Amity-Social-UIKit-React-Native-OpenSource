import { Image, ImageProps } from 'react-native';
import React, { FC, useLayoutEffect, useMemo, useState } from 'react';
import { defaultAvatarUri, defaultCommunityAvatarUri } from '../../../assets';
import { useFile } from '../../../hook';
import { ImageSizeState } from '../../../enum';
import { ComponentID, ElementID, PageID } from '../../../enum/enumUIKitID';
import useConfig from '../../../hook/useConfig';

type AvatarElementType = Partial<ImageProps> & {
  avatarId: string;
  pageID?: PageID;
  componentID?: ComponentID;
  elementID: ElementID;
  targetType?: 'community' | 'user';
  // to bypass the default avatar
  defaultAvatar?: string;
};

const AvatarElement: FC<AvatarElementType> = ({
  avatarId,
  pageID = '*',
  componentID = '*',
  elementID,
  targetType,
  defaultAvatar,
  ...props
}) => {
  const fallbackAvatar = useMemo(() => {
    if (defaultAvatar) return defaultAvatar;
    return targetType === 'community'
      ? defaultCommunityAvatarUri
      : defaultAvatarUri;
  }, [defaultAvatar, targetType]);

  const [avatarUrl, setAvatarUrl] = useState<string>(fallbackAvatar);
  const { excludes } = useConfig();
  const configId = `${pageID}/${componentID}/${elementID}`;
  const { getImage } = useFile();

  useLayoutEffect(() => {
    if (!avatarId) {
      setAvatarUrl(fallbackAvatar);
      return;
    }
    (async () => {
      const avatar = await getImage({
        fileId: avatarId,
        imageSize: ImageSizeState.small,
      });
      setAvatarUrl(avatar);
    })();
  }, [avatarId, fallbackAvatar, getImage]);

  if (excludes.includes(configId)) return null;

  return (
    <Image
      testID={configId}
      accessibilityLabel={configId}
      source={{ uri: avatarUrl }}
      {...props}
    />
  );
};

export default AvatarElement;
