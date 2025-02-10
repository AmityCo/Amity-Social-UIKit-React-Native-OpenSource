import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, { memo, useEffect, useRef } from 'react';
import { useStyles } from './style';
import { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import uiSlice from '../../redux/slices/uiSlice';
import { RootState } from '../../redux/store';
import { PostIconOutlined } from '../../svg/PostIconOutlined';
import { PollIcon } from '../../svg/PollIcon';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCommunity } from '../../hooks';


const PostTypeChoiceModal = () => {
  const styles = useStyles();
  const theme = useTheme() as MyMD3Theme;
  const dispatch = useDispatch();
  const { closePostTypeChoiceModal } = uiSlice.actions;
  const {
    showPostTypeChoiceModal,
    targetId,
    targetName,
    targetType,
  } = useSelector((state: RootState) => state.ui);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { community } = useCommunity(targetId)


  const onChooseType = (type: string) => {
    if (targetId && targetName && targetType && community && type == 'post') {
      closeCreatePostModal();
      navigation.navigate('CreatePost', {
        targetId,
        targetType,
        community: targetType === 'community' ? community : undefined

      });
    } else if (targetId && targetName && targetType && community && type == 'poll') {
      closeCreatePostModal();
      navigation.navigate('CreatePoll', {
        targetId,
        targetType,
        community: targetType === 'community' ? community : undefined

      });
    }
  };
  const closeCreatePostModal = () => {

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
            onPress={() => onChooseType('post')}
            style={styles.modalRow}
          >
            <PostIconOutlined color={theme.colors.base} />
            <Text style={styles.postText}>Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onChooseType('poll')}
            style={styles.modalRow}
          >
            <PollIcon color={theme.colors.base} />
            <Text style={styles.postText}>Poll</Text>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default memo(PostTypeChoiceModal);
