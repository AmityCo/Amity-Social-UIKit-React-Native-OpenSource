import { Image, ImageProps } from 'react-native';
import React, { FC, useLayoutEffect, useState } from 'react';
// import { defaultAvatarUri, defaultCommunityAvatarUri } from '../../assets';



import useConfig from '../../hooks/useConfig';
import { ComponentID, ElementID, ImageSizeState, PageID } from '../../enum';
import { useFileV4 } from '../../hooks/useFilev4';
import UserIcon from '../../svg/UserIcon';
import CommunityIcon from '../../svg/CommunityIcon';



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
  // const defaultAvatar =
  //   targetType === 'community' ? defaultCommunityAvatarUri : defaultAvatarUri;
  const defaultAvatar =
    targetType === 'community' ? <CommunityIcon {...props} width={40} height={40} /> : <UserIcon width={40} height={40} {...props} />;
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const { excludes } = useConfig();
  const configId = `${pageID}/${componentID}/${elementID}`;
  const { getImage } = useFileV4();

  useLayoutEffect(() => {
    if (!avatarId) {
      // setAvatarUrl(defaultAvatar);
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
    !avatarId ?
      defaultAvatar :
      <Image
        testID={configId}
        accessibilityLabel={configId}
        source={{ uri: avatarUrl }}
        width={40}
        height={40}
        {...props}
      />
  );
};

export default AvatarElement;
