import { Text, View } from 'react-native';
import { useStyles } from './style';
import React, { memo, useCallback, useState } from 'react';
import { usePoll } from './usePoll';
import PollOptionList from './Components/PollOptionList';
import { PollRepository } from '@amityco/ts-sdk-react-native';

interface IPollSection {
  pollId: string;
}

const PollSection: React.FC<IPollSection> = ({ pollId }) => {
  const styles = useStyles();
  const [shouldFetch, setShouldFetch] = useState(false);
  const {
    data: pollData,
    endDays,
    totalVote,
    isPollClosed,
    isAlreadyVoted,
  } = usePoll(pollId, shouldFetch);

  const onSubmit = useCallback(
    async (answerIds: string[]) => {
      await PollRepository.votePoll(pollId, answerIds);
      setShouldFetch(!shouldFetch);
    },
    [pollId, shouldFetch]
  );

  if (pollData) {
    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <Text style={styles.pollEndDays}>
            {isPollClosed ? 'Final result' : `Poll ends in ${endDays} days`}
          </Text>
          <Text style={styles.totalVote}>{totalVote} votes</Text>
        </View>
        <PollOptionList
          onSubmit={onSubmit}
          options={pollData.answers}
          answerType={pollData.answerType}
          isAlreadyVoted={isAlreadyVoted}
          isPollClosed={isPollClosed}
          totalVote={totalVote}
        />
      </View>
    );
  }
  return null;
};

export default memo(PollSection);
