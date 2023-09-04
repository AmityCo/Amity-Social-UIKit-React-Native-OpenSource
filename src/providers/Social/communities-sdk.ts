import { CommunityPostSettings, CommunityRepository } from '@amityco/ts-sdk';

export interface ICreateCommunity {
  description: string;
  displayName: string;
  isPublic: boolean;
  userIds?: string[];
  category: string
}
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
export function createCommunity(communityParam: ICreateCommunity): Promise<any> {
  const communityObject = new Promise(async (resolve) => {
    const newCommunity = {
      description: communityParam.description as string,
      displayName: communityParam.displayName as string,
      isPublic: communityParam.isPublic,
      categoryIds: [communityParam.category] as string[],
      userIds: communityParam.userIds as string[],
      postSetting: CommunityPostSettings.ANYONE_CAN_POST,
    };

    const { data: community } = await CommunityRepository.createCommunity(newCommunity);
    resolve(community);
  });
  return communityObject;
}
