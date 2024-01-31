/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from 'react';
// import { useTranslation } from 'react-i18next';

import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { personXml } from '../../../svg/svg-xml-list';
import { getStyles } from './styles';

import type { UserInterface } from '../../../types/user.interface';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuth from '../../../hooks/useAuth';
import MediaSection from '../../../components/MediaSection';
import { IMentionPosition } from '../../../screens/CreatePost';
import { PostRepository } from '@amityco/ts-sdk-react-native';

export interface IPost {
  postId: string;
  data: Record<string, any>;
  dataType: string | undefined;
  myReactions: string[];
  reactionCount: Record<string, number>;
  commentsCount: number;
  user: UserInterface | undefined;
  updatedAt: string | undefined;
  editedAt: string | undefined;
  createdAt: string;
  targetType: string;
  targetId: string;
  childrenPosts: string[];
  mentionees: string[];
  mentionPosition?: IMentionPosition[];
}
export interface IPendingPostList {
  onAcceptDecline?: (postId: string) => void;
  postDetail: IPost;
  isModerator?: boolean;
}
export interface MediaUri {
  uri: string;
}
export interface IVideoPost {
  thumbnailFileId: string;
  videoFileId: {
    original: string;
  };
}
export default function PendingPostList({
  postDetail,
  onAcceptDecline,
  isModerator = false,
}: IPendingPostList) {
  const [postData, setPostData] = useState<IPost>(postDetail);

  const { apiRegion } = useAuth();
  const styles = getStyles();
  const [textPost, setTextPost] = useState<string>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [mentionPositionArr, setMentionsPositionArr] = useState<
    IMentionPosition[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    data,
    postId,
    createdAt,
    user,
    childrenPosts = [],
    mentionPosition,
  } = postData ?? {};

  useEffect(() => {
    if (mentionPosition) {
      setMentionsPositionArr(mentionPosition);
    }
  }, [mentionPosition]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 200);
    setPostData(postDetail);
  }, [postDetail]);

  useEffect(() => {
    setTextPost(data?.text);
  }, [postDetail]);

  function getTimeDifference(timestamp: string): string {
    // Convert the timestamp string to a Date object
    const timestampDate = Date.parse(timestamp);

    // Get the current date and time
    const currentDate = Date.now();

    // Calculate the difference in milliseconds
    const differenceMs = currentDate - timestampDate;

    const differenceYear = Math.floor(
      differenceMs / (1000 * 60 * 60 * 24 * 365)
    );
    const differenceDay = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    const differenceHour = Math.floor(differenceMs / (1000 * 60 * 60));
    const differenceMinutes = Math.floor(differenceMs / (1000 * 60));
    const differenceSec = Math.floor(differenceMs / 1000);

    if (differenceSec < 60) {
      return 'Just now';
    } else if (differenceMinutes < 60) {
      return (
        differenceMinutes +
        ` ${differenceMinutes === 1 ? 'min ago' : 'mins ago'}`
      );
    } else if (differenceHour < 24) {
      return (
        differenceHour + ` ${differenceHour === 1 ? 'hour ago' : 'hours ago'}`
      );
    } else if (differenceDay < 365) {
      return (
        (differenceDay !== 1 ? differenceDay : '') +
        ` ${differenceDay === 1 ? 'Yesterday' : 'days ago'}`
      );
    } else {
      return (
        differenceYear + ` ${differenceYear === 1 ? 'year ago' : 'years ago'}`
      );
    }
  }

  const handleDisplayNamePress = () => {
    if (user?.userId) {
      navigation.navigate('UserProfile', {
        userId: user.userId,
      });
    }
  };

  const RenderTextWithMention = () => {
    if (mentionPositionArr.length === 0) {
      return <Text style={styles.inputText}>{textPost}</Text>;
    }
    const mentionClick = (userId: string) => {
      navigation.navigate('UserProfile', {
        userId: userId,
      });
    };
    let currentPosition = 0;
    const result: (string | JSX.Element)[][] = mentionPositionArr.map(
      ({ index, length, userId }, i) => {
        // Add non-highlighted text before the mention
        const nonHighlightedText = textPost.slice(currentPosition, index);

        // Add highlighted text
        const highlightedText = (
          <Text
            onPress={() => mentionClick(userId)}
            key={`highlighted-${i}`}
            style={styles.mentionText}
          >
            {textPost.slice(index, index + length)}
          </Text>
        );

        // Update currentPosition for the next iteration
        currentPosition = index + length;
        // Return an array of non-highlighted and highlighted text
        return [nonHighlightedText, highlightedText];
      }
    );

    // Add any remaining non-highlighted text after the mentions
    const remainingText = textPost.slice(currentPosition);
    result.push([
      <Text key="nonHighlighted-last" style={styles.inputText}>
        {remainingText}
      </Text>,
    ]);

    // Flatten the array and render
    return <Text style={styles.inputText}>{result.flat()}</Text>;
  };

  const memoizedMediaSection = useMemo(() => {
    return <MediaSection childrenPosts={childrenPosts} />;
  }, [childrenPosts]);

  async function approvePost() {
    onAcceptDecline && onAcceptDecline(postId);
    await PostRepository.approvePost(postId);
  }
  async function declinePost() {
    onAcceptDecline && onAcceptDecline(postId);
    await PostRepository.declinePost(postId);
  }
  return (
    <View key={postId} style={styles.postWrap}>
      <View style={styles.headerSection}>
        <View style={styles.user}>
          {user?.avatarFileId ? (
            <Image
              style={styles.avatar}
              source={{
                uri: `https://api.${apiRegion}.amity.co/api/v3/files/${user?.avatarFileId}/download`,
              }}
            />
          ) : (
            <View style={styles.avatar}>
              <SvgXml xml={personXml} width="20" height="16" />
            </View>
          )}

          <View>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={handleDisplayNamePress}>
                <Text style={styles.headerText}>{user?.displayName}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.headerTextTime}>
                {getTimeDifference(createdAt)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View>
        <View style={styles.bodySection}>
          {/* {textPost && <Text style={styles.bodyText}>{textPost}</Text>} */}
          {textPost && <RenderTextWithMention />}
          {childrenPosts.length > 0 && (
            <View style={styles.mediaWrap}>
              {!loading && memoizedMediaSection}
            </View>
          )}
        </View>
        {isModerator && (
          <View style={styles.actionSection}>
            <TouchableOpacity
              onPress={() => approvePost()}
              style={styles.acceptBtn}
            >
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => declinePost()}
              style={styles.declineBtn}
            >
              <Text style={styles.declineBtnText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
