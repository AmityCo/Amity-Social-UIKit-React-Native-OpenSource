import { Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useCallback } from 'react';
import { useStyles } from './styles';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { useReaction } from '../../hooks/useReaction';
import { SvgXml } from 'react-native-svg';
import { fileSearch } from '../../svg/svg-xml-list';
import { formatNumber } from '../../util/numberUtil';

const ReactionListScreen = ({ navigation, route }) => {
  const { referenceId, referenceType } = route.params;
  const styles = useStyles();
  const { reactions, reactors, loading } = useReaction({
    referenceId,
    referenceType,
  });
  const isError = !reactions || !reactors || reactors?.length === 0;

  const onPressReactor = useCallback(
    (userId: string) => {
      navigation.navigate('UserProfile', { userId });
    },
    [navigation]
  );

  const renderReactors = useCallback(
    ({ item }: { item: Amity.User }) => {
      const avatarUrl = item.avatar?.fileUrl
        ? { uri: item.avatar?.fileUrl }
        : require('../../../assets/icon/Placeholder.png');

      return (
        <TouchableOpacity
          style={styles.rowContainer}
          onPress={() => onPressReactor(item.userId)}
        >
          <Image source={avatarUrl} style={styles.avater} />
          <Text style={styles.userName}>{item.displayName}</Text>
        </TouchableOpacity>
      );
    },
    [onPressReactor, styles]
  );
  const renderContentLoading = useCallback(() => {
    return Array.from({ length: 8 }, (_, index) => {
      return (
        <ContentLoader
          key={index}
          height={70}
          speed={1}
          width={380}
          backgroundColor={'#d2d2d2'}
          foregroundColor={'#eee'}
          viewBox="-10 -10 380 70"
        >
          <Rect x="48" y="8" rx="3" ry="3" width="188" height="6" />
          <Rect x="48" y="26" rx="3" ry="3" width="152" height="6" />
          <Circle cx="20" cy="20" r="20" />
        </ContentLoader>
      );
    });
  }, []);

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
  }, [styles.errorContainer, styles.errorDesc, styles.errorTitle]);

  const renderContent = useCallback(() => {
    return (
      <>
        <View style={styles.header}>
          <View style={styles.reactionCountContainer}>
            <Text style={styles.reactionCount}>
              All {formatNumber(reactions?.all)}
            </Text>
          </View>
        </View>
        <FlatList
          data={reactors}
          renderItem={renderReactors}
          keyExtractor={(item) => item.userId}
        />
      </>
    );
  }, [reactions?.all, reactors, renderReactors, styles]);

  return (
    <View style={styles.container}>
      {loading
        ? renderContentLoading()
        : isError
        ? errorContent()
        : renderContent()}
    </View>
  );
};

export default ReactionListScreen;
