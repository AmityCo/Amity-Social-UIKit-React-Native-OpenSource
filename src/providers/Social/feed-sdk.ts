import { FeedRepository } from '@amityco/ts-sdk';

export async function getGlobalFeed(): Promise<any> {
  const feedObject = new Promise(async (resolve, reject) => {
    // let postOject;
    const data = await FeedRepository.queryGlobalFeed();
    console.log('data: ', data);
  });
  return feedObject;
}
