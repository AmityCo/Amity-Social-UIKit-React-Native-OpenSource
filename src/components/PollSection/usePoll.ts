import { useEffect, useMemo, useState } from 'react';
import { getPollById } from '../../providers/Social/pool.sdk';
import dayjs from 'dayjs';

export const usePoll = (pollId: string, shouldFetch: boolean) => {
  const [pollData, setPollData] = useState<Amity.Poll | undefined>(undefined);

  const endDays = useMemo(() => {
    if (pollData?.closedAt) {
      const endDate = dayjs(pollData.closedAt);
      const daysRemaining = endDate.diff(dayjs(), 'day');
      return daysRemaining || 0;
    }
    return 0;
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
        const { data } = await getPollById(pollId);
        setPollData(data);
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
