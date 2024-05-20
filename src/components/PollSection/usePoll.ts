import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { PollRepository } from '@amityco/ts-sdk-react-native';

dayjs.extend(utc);

export const usePoll = (pollId: string, shouldFetch: boolean) => {
  const [pollData, setPollData] = useState<Amity.Poll | undefined>(undefined);

  const endDays = useMemo(() => {
    const now = dayjs().utc();
    if (pollData?.closedAt) {
      const endDate = dayjs(pollData.closedAt);
      const hoursRemaining = endDate.diff(now, 'hour');
      const daysRemaining = Math.ceil(hoursRemaining / 24);
      const dayText = daysRemaining > 1 ? 'days' : 'day';
      return `${daysRemaining} ${dayText}`;
    }
    return null;
  }, [pollData]);

  const isPollClosed = useMemo(() => {
    if (pollData?.status) {
      return pollData.status === 'closed';
    }
    return false;
  }, [pollData]);

  const totalVote = useMemo(() => {
    if (pollData?.answers?.length > 0) {
      const total = pollData.answers.reduce((acc, poll) => {
        return acc + poll.voteCount;
      }, 0);
      return total;
    } else {
      return 0;
    }
  }, [pollData]);

  const isAlreadyVoted = useMemo(() => {
    if (pollData?.answers) {
      return pollData.answers.some((answer) => answer.isVotedByUser);
    }
    return false;
  }, [pollData]);

  useEffect(() => {
    (async () => {
      try {
        PollRepository.getPoll(pollId, ({ data }) => setPollData(data));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [pollId, shouldFetch]);

  return {
    data: pollData,
    endDays,
    totalVote,
    isPollClosed,
    isAlreadyVoted,
  };
};
