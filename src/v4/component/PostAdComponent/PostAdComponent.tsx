import React, { FC, memo } from 'react';
import { Image, View, TouchableOpacity, Linking } from 'react-native';

import { ComponentID, PageID } from '../../enum';
import { useStyles } from './styles';
import PostAdHeader from './PostAdHeader';
import { useAmityComponent } from '../../hook';
import { Text } from 'react-native-paper';
import { infoIcon } from '../../../svg/svg-xml-list';
import { SvgXml } from 'react-native-svg';
import AdInformation from '../AdInformation/AdInformation';
import bottomSheetSlice from '../../../redux/slices/bottomSheetSlice';
import { useDispatch } from 'react-redux';
import AdEngine from '../../engine/AdEngine';
import AssetDownloader from '../../engine/AssetDownloader';

type PostAdComponentType = {
  pageId?: PageID;
  ad?: Amity.Ad;
};

const PostAdComponent: FC<PostAdComponentType> = ({
  ad,
  pageId = PageID.WildCardPage,
}) => {
  const componentId = ComponentID.post_content;
  const dispatch = useDispatch();

  const { openBottomSheet } = bottomSheetSlice.actions;
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId: pageId,
    componentId: componentId,
  });

  const styles = useStyles(themeStyles);

  if (!ad) return null;

  return (
    <View style={styles.container} testID={accessibilityId}>
      <TouchableOpacity
        style={styles.infoIcon}
        onPress={() => {
          ad?.advertiser?.companyName &&
            dispatch(
              openBottomSheet({
                content: (
                  <AdInformation
                    pageId={pageId}
                    companyName={ad.advertiser.companyName}
                  />
                ),
                height: 400,
              })
            );
        }}
      >
        <SvgXml xml={infoIcon()} width="16" height="16" />
      </TouchableOpacity>
      <PostAdHeader advertiser={ad?.advertiser} pageId={pageId} />
      {ad.body && <Text style={styles.textContent}>{ad.body}</Text>}
      {ad?.image1_1?.fileUrl && (
        <Image
          source={{
            uri: `file://${AssetDownloader.instance.getFilePath(
              ad?.image1_1?.fileUrl + '?size=large'
            )}`,
          }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.footer}>
        <View style={styles.footerTextWrap}>
          <Text numberOfLines={1} style={styles.footerDescription}>
            {ad?.description}
          </Text>
          <Text numberOfLines={2} style={styles.footerHeadline}>
            {ad?.headline}
          </Text>
        </View>
        {ad?.callToActionUrl && (
          <TouchableOpacity
            style={styles.callToActionButton}
            onPress={() => {
              AdEngine.instance.markClicked(ad, 'feed' as Amity.AdPlacement);
              Linking.openURL(ad?.callToActionUrl);
            }}
          >
            <Text style={styles.callToActionText}>{ad.callToAction}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default memo(PostAdComponent);
