import { Image, ImageProps, StyleSheet } from 'react-native';
import React, { FC, memo, useEffect, useState } from 'react';

import { defaultAvatarUri } from '../../assets';
import { UserRepository } from '@amityco/ts-sdk-react-native';
import { ImageSizeState } from '../../enum';
import useAuth from '../../hooks/useAuth';
import { useFileV4 } from '../../hooks/useFilev4';
import { SvgXml } from 'react-native-svg';
import { personXml } from '../../svg/svg-xml-list';


type MyAvatarProp = Partial<ImageProps>;
const MyAvatar: FC<MyAvatarProp> = (props) => {
  const { client } = useAuth();
  const { getImage } = useFileV4();
  const myId = (client as Amity.Client).userId;
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    UserRepository.getUser(myId, async ({ data, loading, error }) => {
      if (!loading && !error) {
        const avatar = await getImage({
          fileId: data?.avatarFileId,
          imageSize: ImageSizeState.small,
        });
        setAvatarUrl(avatar ?? defaultAvatarUri);
      }
    });
  }, [getImage, myId]);

  return (
    avatarUrl.length > 0 ? <Image source={{ uri: avatarUrl }} style={styles.img} {...props} /> : <SvgXml xml={personXml} />
  )

};

export default memo(MyAvatar);

const styles = StyleSheet.create({
  img: {
    width: 32,
    height: 32,
    borderRadius: 32,
  },
});
