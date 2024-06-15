import { Image, ImageProps } from 'react-native';
import React, { FC, useLayoutEffect, useState } from 'react';
import { defaultAvatarUri, defaultCommunityAvatarUri } from '../../assets';



import useConfig from '../../hooks/useConfig';
import { ComponentID, ElementID, ImageSizeState, PageID } from '../../enum';
import { useFileV4 } from '../../hooks/useFilev4';


type AvatarElementType = Partial<ImageProps> & {
  avatarId: string;
  pageID?: PageID;
  componentID?: ComponentID;
  elementID: ElementID;
  targetType?: 'community' | 'user';
};

const AvatarElement: FC<AvatarElementType> = ({
  avatarId,
  pageID = '*',
  componentID = '*',
  elementID,
  targetType,
  ...props
}) => {
  const defaultAvatar =
    targetType === 'community' ? defaultCommunityAvatarUri : defaultAvatarUri;
  const [avatarUrl, setAvatarUrl] = useState<string>(defaultAvatar);
  const { excludes } = useConfig();
  const configId = `${pageID}/${componentID}/${elementID}`;
  const { getImage } = useFileV4();

  useLayoutEffect(() => {
    if (!avatarId) {
      setAvatarUrl(defaultAvatar);
      return;
    }
    (async () => {
      const avatar = await getImage({
        fileId: avatarId,
        imageSize: ImageSizeState.small,
      });
      setAvatarUrl(avatar);
    })();
  }, [avatarId, defaultAvatar, getImage]);

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
