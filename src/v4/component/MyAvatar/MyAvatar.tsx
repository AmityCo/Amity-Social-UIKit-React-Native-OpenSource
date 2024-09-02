import { Image, ImageProps, StyleSheet } from 'react-native';
import React, { FC, memo, useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useFile } from '../../hook';
import { defaultAvatarUri } from '../../assets';
import { UserRepository } from '@amityco/ts-sdk-react-native';
import { ImageSizeState } from '../../enum';

type MyAvatarProp = Partial<ImageProps>;
const MyAvatar: FC<MyAvatarProp> = (props) => {
  const { client } = useAuth();
  const { getImage } = useFile();
  const myId = (client as Amity.Client).userId;
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatarUri);

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

  return <Image source={{ uri: avatarUrl }} style={styles.img} {...props} />;
};

export default memo(MyAvatar);

const styles = StyleSheet.create({
  img: {
    width: 32,
    height: 32,
    borderRadius: 32,
  },
});
