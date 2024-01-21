import {
  CommunityPostSettings,
  CommunityRepository,
} from '@amityco/ts-sdk-react-native';

export interface ICreateCommunity {
  description: string;
  displayName: string;
  isPublic: boolean;
  userIds?: string[];
  category: string;
  avatarFileId?: string;
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
export function createCommunity(
  communityParam: ICreateCommunity
): Promise<any> {
  const communityObject = new Promise(async (resolve) => {
    const newCommunity = {
      description: communityParam.description as string,
      displayName: communityParam.displayName as string,
      isPublic: communityParam.isPublic,
      categoryIds: [communityParam.category] as string[],
      userIds: communityParam.userIds as string[],
      postSetting: CommunityPostSettings.ANYONE_CAN_POST,
      avatarFileId:
        communityParam.avatarFileId.length > 0
          ? communityParam.avatarFileId
          : undefined,
    };

    const { data: community } = await CommunityRepository.createCommunity(
      newCommunity
    );
    resolve(community);
  });
  return communityObject;
}

export const updateCommunity = (
  communityId: string,
  communityParam: ICreateCommunity
): Promise<Amity.Community | unknown> => {
  const communityObject = new Promise(async (resolve, reject) => {
    try {
      const newCommunity = {
        description: communityParam.description,
        displayName: communityParam.displayName,
        isPublic: communityParam.isPublic,
        categoryIds: [communityParam.category],
        avatarFileId: communityParam?.avatarFileId ?? undefined,
      };
      const { data: community } = await CommunityRepository.updateCommunity(
        communityId,
        newCommunity
      );
      resolve(community);
    } catch (error) {
      reject(error);
    }
  });
  return communityObject;
};

export async function checkCommunityPermission(
  communityId: string,
  client: Amity.Client,
  apiRegion: string
): Promise<any> {
  const url: string = `https://api.${apiRegion}.amity.co/api/v3/communities/${communityId}/permissions/me`;
  const accessToken = client.token.accessToken;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('error:', error);
  }
}
