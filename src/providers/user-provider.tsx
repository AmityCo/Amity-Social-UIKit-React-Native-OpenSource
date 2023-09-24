import {
  runQuery,
  createQuery,
  createReport,
  UserRepository,
} from '@amityco/ts-sdk-react-native';
import type { UserGroup } from '../types/user.interface';

export function groupUsers(users: Amity.User[]): UserGroup[] {
  const groups: UserGroup[] = [];
  const sortedUsers = users.sort((a, b) =>
    a.displayName!.localeCompare(b.displayName!)
  );
  let currentChar = '';
  let currentGroup: Amity.User[] = [];

  sortedUsers.forEach((user) => {
    const firstChar = user.displayName!.charAt(0).toUpperCase();
    if (firstChar !== currentChar) {
      if (currentGroup.length > 0) {
        groups.push({ title: currentChar, data: currentGroup });
      }
      currentChar = firstChar;
      currentGroup = [user];
    } else {
      currentGroup.push(user);
    }
  });

  if (currentGroup.length > 0) {
    groups.push({ title: currentChar, data: currentGroup });
  }

  return groups;
}

export async function reportUser(userId: string): Promise<boolean> {
  return await new Promise((resolve, reject) => {
    const query = createQuery(createReport, 'user', userId);

    runQuery(query, (options) => {
      if (options.loading == false) {
        if (options.data !== undefined) {
          return resolve(options.data);
        } else {
          return reject(new Error('Unable to report user ' + options.error));
        }
      }
    });
  });
}

export async function getAmityUser(userId: string): Promise<any> {
  return await new Promise((resolve, reject) => {
    let userObject: Record<string, any> = {};
    const unsubscribe = UserRepository.getUser(userId, (value) => {
      if (value) {
        userObject = value;
        resolve({ userObject, unsubscribe });
      } else {
        reject((value as Record<string, any>).error);
      }
    });
  });
}
