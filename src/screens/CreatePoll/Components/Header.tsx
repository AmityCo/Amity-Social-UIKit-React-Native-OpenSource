import { Text, TouchableOpacity, View } from 'react-native';
import React, { FC, memo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStyles } from '../styles';
import { SvgXml } from 'react-native-svg';
import { closeIcon } from '../../../svg/svg-xml-list';
import type { MyMD3Theme } from '../../../providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';

interface IHeader {
  targetName: string;
  goBack: () => void;
  isBtnDisable: boolean;
  handleCreatePost: () => void;
}

const Header: FC<IHeader> = ({
  targetName,
  goBack,
  isBtnDisable,
  handleCreatePost,
}) => {
  const styles = useStyles();
  const theme = useTheme() as MyMD3Theme;

  return (
    <SafeAreaView style={styles.barContainer} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={goBack}>
          <SvgXml xml={closeIcon(theme.colors.base)} width="17" height="17" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>{targetName}</Text>
        </View>
        <TouchableOpacity disabled={isBtnDisable} onPress={handleCreatePost}>
          <Text style={isBtnDisable ? styles.disabled : styles.postText}>
            Post
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default memo(Header);
