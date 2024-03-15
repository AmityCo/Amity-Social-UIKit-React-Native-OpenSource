/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { usePrevious } from './helpers/StateHelpers';
import { IUserStory, StoryCircleListItemProps } from './interfaces';

import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '../../../providers/amity-ui-kit-provider';
import { SvgXml } from 'react-native-svg';
import {
  communityIcon,
  officialIcon,
  privateIcon,
  storyRing,
} from '../../../svg/svg-xml-list';
import useConfig from '../../../hooks/useConfig';
import { ElementID } from '../../../util/enumUIKitID';

const StoryCircleListItem = ({
  item,
  handleStoryItemPress,
  isCommunityStory = false,
}: StoryCircleListItemProps) => {
  const theme = useTheme() as MyMD3Theme;
  const styles = useStyles();
  const [, setIsPressed] = useState(item?.seen);

  const prevSeen = usePrevious(item?.seen);
  const { getConfig } = useConfig();
  const [storyRingColor, setStoryRingColor] = useState<string[]>([]);

  useLayoutEffect(() => {
    const colorRings: string[] = getConfig(
      ElementID.StoryRingOnStoryTab
    ).progress_color;
    setStoryRingColor(colorRings);
  }, []);
  useEffect(() => {
    if (prevSeen != item?.seen) {
      setIsPressed(item?.seen);
    }
  }, [item?.seen]);

  const _handleItemPress = (item: IUserStory) => {
    if (handleStoryItemPress) handleStoryItemPress(item);

    setIsPressed(true);
  };

  return (
    <View>
      {/* <TouchableOpacity
        onPress={() => _handleItemPress(item)}
        style={[
          styles.avatarWrapper,
          {
            height: avatarWrapperSize,
            width: avatarWrapperSize,
          },
          avatarWrapperStyle,
          !isPressed
            ? {
                borderColor: unPressedBorderColor ?? 'red',
              }
            : {
                borderColor: pressedBorderColor ?? 'grey',
              },
        ]}
      > */}
      <TouchableOpacity
        onPress={() => _handleItemPress(item)}
        style={styles.itemContainer}
      >
        <View>
          {item.user_image ? (
            <Image
              source={{ uri: item.user_image }}
              style={isCommunityStory ? styles.communityAvatar : styles.avatar}
            />
          ) : (
            <SvgXml
              style={isCommunityStory ? styles.communityAvatar : styles.avatar}
              width={isCommunityStory ? 40 : 56}
              height={isCommunityStory ? 40 : 56}
              xml={communityIcon}
            />
          )}
          <SvgXml
            style={styles.storyRing}
            width={isCommunityStory ? 48 : 64}
            height={isCommunityStory ? 48 : 64}
            xml={storyRing(
              item?.stories?.length > 0 ? storyRingColor[0] : '#EBECEF',
              item?.stories?.length > 0
                ? storyRingColor.length > 1
                  ? storyRingColor[1]
                  : storyRingColor[0]
                : '#EBECEF'
            )}
          />
          {item.isOfficial && !isCommunityStory && (
            <SvgXml
              style={styles.officialIcon}
              xml={officialIcon(theme.colors.primary)}
            />
          )}
        </View>

        <View style={styles.textRow}>
          {!item.isPublic && (
            <SvgXml
              width={17}
              height={17}
              xml={privateIcon(theme.colors.base)}
            />
          )}
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemText}>
            {isCommunityStory ? 'Story' : item.user_name}
          </Text>
        </View>
      </TouchableOpacity>
      {/* {showText && (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            {
              width: avatarWrapperSize,
              ...styles.text,
              ...avatarTextStyle,
            },
            isPressed
              ? { color: pressedAvatarTextColor || undefined }
              : { color: unPressedAvatarTextColor || undefined },
          ]}
        >
          {item.user_name}
        </Text>
      )} */}
    </View>
  );
};

export default StoryCircleListItem;

// const styles2 = StyleSheet.create({
//   container: {
//     marginVertical: 5,
//     marginRight: 10,
//   },
//   avatarWrapper: {
//     borderWidth: 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     borderRadius: 100,
//     height: 64,
//     width: 64,
//   },
//   text: {
//     marginTop: 3,
//     textAlign: 'center',
//     alignItems: 'center',
//     fontSize: 11,
//   },
// });
export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;

  const styles = StyleSheet.create({
    title: {
      fontSize: 17,
      fontWeight: '600',
      margin: 1,
      color: theme.colors.base,
    },
    scrollView: {
      justifyContent: 'space-between',
    },
    itemContainer: {
      alignItems: 'center',
      width: 68,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 56,
      margin: 4,
    },
    communityAvatar: {
      width: 40,
      height: 40,
      borderRadius: 56,
      margin: 4,
    },
    itemText: {
      fontSize: 13,
      fontWeight: '400',
      color: theme.colors.base,
    },
    textRow: {
      marginTop: 6,
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    arrowIcon: {
      marginRight: 16,
      display: 'flex',
    },
    seeAllBtn: {
      marginRight: 16,
    },
    seeAllIcon: {
      width: 40,
      height: 40,
      borderRadius: 25,
      backgroundColor: '#ededed',
      alignItems: 'center',
      justifyContent: 'center',
    },
    seeAllText: {
      fontSize: 13,
      marginTop: 6,
    },
    storyRing: {
      position: 'absolute',
    },
    officialIcon: {
      position: 'absolute',
      left: 45,
      top: 42,
    },
  });

  return styles;
};
