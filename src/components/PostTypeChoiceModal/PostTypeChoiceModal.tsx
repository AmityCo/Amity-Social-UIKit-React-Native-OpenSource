import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, { memo, useEffect, useRef, useState } from 'react';
import { SvgXml } from 'react-native-svg';
import CreatePostChooseTargetModal from '../CreatePostChooseTargetModal/CreatePostChooseTargetModal';
import {
  livestreamIcon,
  pollIcon,
  postIconOutlined,
} from '../../svg/svg-xml-list';
import { useStyles } from './style';
import { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import uiSlice from '../../redux/slices/uiSlice';
import { RootState } from 'src/redux/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/RouteParamList';

const PostTypeChoiceModal = () => {
  const styles = useStyles();
  const theme = useTheme() as MyMD3Theme;
  const dispatch = useDispatch();
  const navigation =
    useNavigation() as NativeStackNavigationProp<RootStackParamList>;
  const { closePostTypeChoiceModal } = uiSlice.actions;
  const {
    showPostTypeChoiceModal,
    userId,
    targetId,
    targetName,
    targetType,
    postSetting,
    needApprovalOnPostCreation,
    isPublic,
  } = useSelector((state: RootState) => state.ui);
  const [postType, setPostType] = useState<string>();
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);

  const onChooseType = (type: string) => {
    if (targetId && targetName && targetType) {
      const targetscreen =
        type === 'post'
          ? 'CreatePost'
          : type === 'poll'
          ? 'CreatePoll'
          : type === 'livestream'
          ? 'CreateLivestream'
          : null;

      navigation.navigate(targetscreen, {
        targetId,
        targetName,
        targetType,
        postSetting,
        needApprovalOnPostCreation,
        isPublic,
      });
      closeCreatePostModal();
    } else {
      setPostType(type);
      setCreatePostModalVisible(true);
    }
  };
  const closeCreatePostModal = () => {
    setCreatePostModalVisible(false);
    closeModal();
  };

  const closeModal = () => {
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      dispatch(closePostTypeChoiceModal());
    });
  };
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showPostTypeChoiceModal) {
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [slideAnimation, showPostTypeChoiceModal]);

  const modalStyle = {
    transform: [
      {
        translateY: slideAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [600, 0], // Adjust this value to control the sliding distance
        }),
      },
    ],
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showPostTypeChoiceModal}
      onRequestClose={closeModal}
    >
      <Pressable onPress={closeModal} style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, modalStyle]}>
          <TouchableOpacity
            onPress={() => onChooseType('livestream')}
            style={styles.modalRow}
          >
            <SvgXml
              xml={livestreamIcon(theme.colors.base)}
              width="28"
              height="28"
            />
            <Text style={styles.postText}>Livestream</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onChooseType('post')}
            style={styles.modalRow}
          >
            <SvgXml
              xml={postIconOutlined(theme.colors.base)}
              width="28"
              height="28"
            />
            <Text style={styles.postText}>Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onChooseType('poll')}
            style={styles.modalRow}
          >
            <SvgXml xml={pollIcon(theme.colors.base)} width="28" height="28" />
            <Text style={styles.postText}>Poll</Text>
          </TouchableOpacity>
          <CreatePostChooseTargetModal
            visible={createPostModalVisible}
            onClose={closeCreatePostModal}
            userId={userId}
            onSelect={closeCreatePostModal}
            postType={postType}
          />
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default memo(PostTypeChoiceModal);
