import { PollRepository } from '@amityco/ts-sdk-react-native';

export const getPollById = (pollId: string) => {
  const getPollPromise = new Promise<Amity.LiveObject<Amity.Poll>>(
    (resolve, reject) => {
      try {
        PollRepository.getPoll(pollId, (pollData) => {
          if (pollData.error) {
            reject(pollData.error);
          } else {
            resolve(pollData);
          }
        });
      } catch (error) {
        reject(error);
      }
    }
  );
  return getPollPromise;
};

export const createPoll = (
  bundle: Pick<Amity.Poll, 'question' | 'answerType' | 'closedIn'> & {
    answers: Pick<Amity.PollAnswer, 'data' | 'dataType'>[];
  }
) => {
  const createPollPromise = new Promise<Amity.Cached<Amity.Poll>>(
    async (resolve, reject) => {
      try {
        const createdPoll = await PollRepository.createPoll(bundle);
        resolve(createdPoll);
      } catch (error) {
        reject(error);
      }
    }
  );
  return createPollPromise;
};

export const votePoll = ({
  pollId,
  answerIds,
}: {
  pollId: string;
  answerIds: string[];
}) => {
  const votePollPromise = new Promise<Amity.Cached<Amity.Poll>>(
    async (resolve, reject) => {
      try {
        const voted = await PollRepository.votePoll(pollId, answerIds);
        resolve(voted);
      } catch (error) {
        reject(error);
      }
    }
  );
  return votePollPromise;
};

export const closePoll = (pollId: string) => {
  const closePollPromise = new Promise<Amity.Cached<Amity.Poll>>(
    async (resolve, reject) => {
      try {
        const closed = await PollRepository.closePoll(pollId);
        resolve(closed);
      } catch (error) {
        reject(error);
      }
    }
  );
  return closePollPromise;
};

export const deletePoll = (pollId: string) => {
  const deletePollPromise = new Promise<boolean>(async (resolve, reject) => {
    try {
      const deleted = await PollRepository.deletePoll(pollId);
      resolve(deleted);
    } catch (error) {
      reject(error);
    }
  });
  return deletePollPromise;
};
