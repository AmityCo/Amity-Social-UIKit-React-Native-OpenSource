export const enum AmityStoryTabComponentEnum {
  globalFeed = 'globalFeed',
  communityFeed = 'communityFeed',
}

export interface AmityStoryTabComponentType {
  type: AmityStoryTabComponentEnum;
  targetId?: string;
}
