import { CommunityRepository } from '@amityco/ts-sdk';


export function getCommunityById(communityId: string): Promise<any> {
  const communityObject = new Promise((resolve, reject) => {
    let object;
    const unsubscribe = CommunityRepository.getCommunity(
      communityId,
      (data) => {
        if (data.error) {
          reject(data.error);
        }
        object = data;
      }
    );
    resolve({ data: object, unsubscribe });
  });
  return communityObject;
}
