import { Text, TouchableOpacity, View } from 'react-native';
import React, { FC, memo } from 'react';
import { useStyles } from '../styles';
import type { MyMD3Theme } from '../../../providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';
import CloseIcon from '../../../svg/CloseIcon';

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
    <View style={styles.barContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={goBack}>
          <CloseIcon width={17} height={17} color={theme.colors.base} />
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
    </View>
  );
};

export default memo(Header);
