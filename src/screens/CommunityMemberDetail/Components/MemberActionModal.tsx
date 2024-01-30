import {
  Animated,
  Modal,
  Pressable,
  Text,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useStyles } from '../styles';
import { createReport } from '@amityco/ts-sdk-react-native';
import {
  assignRolesToUsers,
  removeRolesFromUsers,
  updateCommunityMember,
} from '../../../providers/Social/communities-sdk';
import useAuth from '../../../hooks/useAuth';

interface IMemberActionModal {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  userId: string;
  communityId: string;
  hasModeratorPermission: boolean;
  isInModeratorTab: boolean;
}

const MemberActionModal: FC<IMemberActionModal> = ({
  isVisible,
  setIsVisible,
  userId,
  communityId,
  hasModeratorPermission,
  isInModeratorTab,
}) => {
  const styles = useStyles();
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const { client } = useAuth() as { client: { userId: string } };
  const currentUserId = client.userId ?? '';
  const actionData = useMemo(
    () => [
      {
        id: 'demote',
        label: 'Dismiss to member',
        shouldShow:
          hasModeratorPermission &&
          currentUserId !== userId &&
          isInModeratorTab,
        callBack: async () =>
          await removeRolesFromUsers(
            communityId,
            ['community-moderator'],
            [userId]
          ),
      },
      {
        id: 'promote',
        label: 'Promote to moderator',
        shouldShow:
          hasModeratorPermission &&
          currentUserId !== userId &&
          !isInModeratorTab,
        callBack: async () =>
          await assignRolesToUsers(
            communityId,
            ['community-moderator'],
            [userId]
          ),
      },
      {
        id: 'report',
        label: 'Report User',
        shouldShow: currentUserId !== userId,
        callBack: async () => await createReport('user', userId),
      },
      {
        id: 'remove',
        label: 'Remove from community',
        shouldShow: hasModeratorPermission,
        callBack: async () =>
          await updateCommunityMember({
            operation: 'REMOVE',
            communityId: communityId,
            memberIds: [userId],
          }),
      },
    ],
    [
      communityId,
      currentUserId,
      hasModeratorPermission,
      isInModeratorTab,
      userId,
    ]
  );

  const closeModal = useCallback(() => {
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsVisible(false));
  }, [setIsVisible, slideAnimation]);

  const onPressAction = useCallback(
    async ({ callBack }) => {
      try {
        await callBack();
      } catch (error) {}
      closeModal();
    },
    [closeModal]
  );

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnimation]);

  const modalStyle = {
    transform: [
      {
        translateY: slideAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [600, 0],
        }),
      },
    ],
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <Pressable onPress={closeModal} style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, modalStyle]}>
          {actionData.map((data) => {
            const warningStyle: TextStyle =
              data.id === 'remove' ? { color: 'red' } : null;
            if (data.shouldShow) {
              return (
                <TouchableOpacity
                  key={data.id}
                  onPress={() => onPressAction(data)}
                  style={styles.modalRow}
                >
                  <Text style={[styles.postText, warningStyle]}>
                    {data.label}
                  </Text>
                </TouchableOpacity>
              );
            } else return null;
          })}
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default memo(MemberActionModal);
