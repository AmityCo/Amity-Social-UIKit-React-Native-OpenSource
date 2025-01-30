import {
  Text,
  TouchableOpacity,
  View,
  Pressable,
  Image,
  FlatList,
} from 'react-native';
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useStyles } from './styles';
import Modal from 'react-native-modalbox';

import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { SvgXml } from 'react-native-svg';
import {
  fileSearch,
  likeReaction,
  loveReaction,
} from '../../svg/svg-xml-list';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes/RouteParamList';
import { defaultAvatarUri } from '../../assets';
import { UserRepository } from '@amityco/ts-sdk-react-native';
import { formatNumber } from './../../util/numberUtil';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { useReaction } from '../../hooks/useReaction';

type AmityReactionListComponentType = {
  referenceId: string;
  referenceType: Amity.ReactableType;
  isModalVisible: boolean;
  onCloseModal: () => void;
};

type ReactionListType = Amity.User & { reactionName: string };

const AmityReactionListComponent: FC<AmityReactionListComponentType> = ({
  referenceId,
  referenceType,
  isModalVisible,
  onCloseModal,
}) => {
  const styles = useStyles();
  const theme = useTheme() as MyMD3Theme;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [reactors, setReactors] = useState<ReactionListType[]>([]);
  const [selectedReactionIndex, setSelectedReactionIndex] = useState<number>(0);
  const {
    loveReactionList,
    likeReactionList,
    allReactionList,
    loading,
    hasError,
  } = useReaction({
    referenceId,
    referenceType,
  });
  const SUPPORTED_REACTIONS = useMemo(
    () => [
      allReactionList?.length,
      likeReactionList?.length,
      loveReactionList?.length,
    ],
    [allReactionList, likeReactionList, loveReactionList]
  );

  useEffect(() => {
    (async () => {
      const currentUsers =
        selectedReactionIndex === 0
          ? allReactionList
          : selectedReactionIndex === 1
          ? likeReactionList
          : selectedReactionIndex === 2
          ? loveReactionList
          : null;
      if (currentUsers?.length > 0) {
        const userList = currentUsers.map((item) => item.userId);
        try {
          const { data } = await UserRepository.getUserByIds(userList);
          const reactorList = data.map((item, index) => ({
            ...item,
            reactionName: currentUsers[index].reactionName,
          }));
          setReactors(reactorList);
        } catch (error) {
          console.log(error);
        }
      } else {
        setReactors([]);
      }
    })();

    return () => {};
  }, [
    allReactionList,
    likeReactionList,
    loveReactionList,
    selectedReactionIndex,
  ]);

  const errorContent = useCallback(() => {
    return (
      <View style={styles.errorContainer}>
        <SvgXml xml={fileSearch()} width={48} height={48} />
        <Text style={styles.errorTitle}>
          Sorry, we couldn't show the content
        </Text>
        <Text style={styles.errorDesc}>
          Please try again or contact the administator{'\n'}for more information
        </Text>
      </View>
    );
  }, [styles]);

  const renderContentLoading = useCallback(() => {
    return Array.from({ length: 8 }, (_, index) => {
      return (
        <ContentLoader
          key={index}
          height={70}
          speed={1}
          width={380}
          backgroundColor={theme.colors.baseShade4}
          foregroundColor={theme.colors.baseShade2}
          viewBox="-10 -10 380 70"
        >
          <Rect x="48" y="8" rx="3" ry="3" width="188" height="6" />
          <Rect x="48" y="26" rx="3" ry="3" width="152" height="6" />
          <Circle cx="20" cy="20" r="20" />
        </ContentLoader>
      );
    });
  }, [theme]);

  const onPressReactor = useCallback(
    (userId: string) => {
      onCloseModal();
      navigation.navigate('UserProfile', { userId });
    },
    [navigation, onCloseModal]
  );

  const renderReactors = useCallback(
    ({ item }: { item: ReactionListType }) => {
      const avatarUrl = item.avatar?.fileUrl ?? defaultAvatarUri;
      const reactionIcon =
        item.reactionName === 'like' ? likeReaction() : loveReaction();
      return (
        <TouchableOpacity
          style={styles.rowContainer}
          onPress={() => onPressReactor(item.userId)}
        >
          <View style={styles.reactorNameContainer}>
            <Image source={{ uri: avatarUrl }} style={styles.avater} />
            <Text style={styles.userName}>{item.displayName}</Text>
          </View>
          <SvgXml xml={reactionIcon} width={18} height={18} />
        </TouchableOpacity>
      );
    },
    [onPressReactor, styles]
  );

  const reactionHeaderComponent = useCallback(() => {
    return (
      <View style={styles.reactionHeaderRow}>
        {SUPPORTED_REACTIONS.map((reactionCount, index) => {
          const onSelect = () => {
            setSelectedReactionIndex(index);
          };
          const selectedReactionTextStyle =
            selectedReactionIndex === index && styles.selectedReaction;
          const selectedReactionBtnStyle =
            selectedReactionIndex === index && styles.selectedReactionBtn;
          const allReactiontext = index === 0 && 'All';
          const reactionIcon = index === 1 ? likeReaction() : loveReaction();
          return (
            <Pressable
              onPress={onSelect}
              style={[styles.reactionBtn, selectedReactionBtnStyle]}
              key={index}
            >
              {index !== 0 && (
                <SvgXml xml={reactionIcon} width={18} height={18} />
              )}
              <Text style={[styles.reaction, selectedReactionTextStyle]}>
                {allReactiontext} {formatNumber(reactionCount)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }, [SUPPORTED_REACTIONS, selectedReactionIndex, styles]);

  const renderReactionList = useCallback(() => {
    return (
      <FlatList
        style={{ width: '100%' }}
        data={reactors}
        renderItem={renderReactors}
        keyExtractor={(item) => item.userId}
        ListHeaderComponent={reactionHeaderComponent}
      />
    );
  }, [reactionHeaderComponent, reactors, renderReactors]);

  return (
    <Modal
      style={styles.modal}
      isOpen={isModalVisible}
      onClosed={onCloseModal}
      position="bottom"
      swipeToClose
      swipeArea={250}
      backButtonClose
      coverScreen={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.handleBar} />
        {loading
          ? renderContentLoading()
          : hasError
          ? errorContent()
          : reactors
          ? renderReactionList()
          : null}
      </View>
    </Modal>
  );
};

export default memo(AmityReactionListComponent);
