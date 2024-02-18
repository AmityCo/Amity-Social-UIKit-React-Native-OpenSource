import { View, ViewStyle } from 'react-native';
import React, { FC, memo } from 'react';
import { useStyles } from '../style';

interface IPollBar {
  myVote: boolean;
  length: number;
}

const PollBar: FC<IPollBar> = ({ myVote, length }) => {
  const styles = useStyles();
  const myVoteBarStyle: ViewStyle = myVote && styles.myVoteBar;
  const barLengthStyle: ViewStyle = { width: `${length}%` };
  return (
    <View style={styles.backgroundBar}>
      <View style={[styles.innerBar, myVoteBarStyle, barLengthStyle]} />
    </View>
  );
};

export default memo(PollBar);
