import React, { FC, memo } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { infoIcon } from '../../../svg/svg-xml-list';
import { SvgXml } from 'react-native-svg';
import { useStyles } from './styles';
import { ComponentID, PageID } from '../../enum';
import { useAmityComponent } from '../../hook';

type AdInformationType = {
  pageId?: PageID;
  companyName: string;
};

const AdInformation: FC<AdInformationType> = ({
  pageId = PageID.WildCardPage,
  companyName,
}) => {
  const componentId = ComponentID.post_content;

  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId: componentId,
  });
  const styles = useStyles(themeStyles);

  return (
    <View testID={accessibilityId} style={styles.container}>
      <Text style={styles.header}>About this advertisement</Text>
      <View style={styles.divider} />
      <View style={styles.content}>
        <View style={styles.contentItem}>
          <Text style={styles.contentTitle}>Why this advertisement?</Text>
          <View style={styles.contentDetail}>
            <SvgXml
              style={styles.infoIcon}
              xml={infoIcon()}
              width="16"
              height="16"
            />
            <Text style={styles.contentDetailText}>
              You're seeing this advertisement because it was displayed to all
              users in the system.
            </Text>
          </View>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.contentTitle}>About this advertiser</Text>
          <View style={styles.contentDetail}>
            <SvgXml
              style={styles.infoIcon}
              xml={infoIcon()}
              width="16"
              height="16"
            />
            <Text style={styles.contentDetailText}>
              Advertiser name: {companyName}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(AdInformation);
