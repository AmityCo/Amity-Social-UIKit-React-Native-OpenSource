import { FeedRepository } from '@amityco/ts-sdk';

export interface IGlobalFeedRes {
  data: Amity.Post<any>[];
  nextPage: Amity.Page<number> | undefined;
  prevPage: Amity.Page<number> | undefined;
}

export async function getGlobalFeed(): Promise<IGlobalFeedRes> {
  const feedObject: Promise<IGlobalFeedRes> = new Promise(
    async (resolve, reject) => {
      try {
        const { data, nextPage, prevPage } =
          await FeedRepository.queryGlobalFeed();
        resolve({ data, nextPage, prevPage });
      } catch (error) {
        reject(error);
      }
    }
  );
  return feedObject;
}
