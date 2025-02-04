import { Image, ImageProps } from 'react-native';
import React, { FC, useLayoutEffect, useState } from 'react';
import { ComponentID, ElementID, ImageSizeState, PageID } from '../../enum';
import useConfig from '../../hooks/useConfig';

import { SvgXml } from 'react-native-svg';
import { communityIcon, userIcon } from '../../svg/svg-xml-list';
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
    targetType === 'community' ? <SvgXml  width={40} height={40} xml={communityIcon} /> : <SvgXml style={{marginRight: 12}} width={40} height={40} xml={userIcon()} />;
  const [avatarUrl, setAvatarUrl] = useState<string>('');
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
    avatarId ?
      <Image
        testID={configId}
        accessibilityLabel={configId}
        source={{ uri: avatarUrl }}
        {...props}
      /> : defaultAvatar


  );
};

export default AvatarElement;
