import { PhotoFile, VideoFile } from 'react-native-vision-camera';

export const enum AmityStoryTabComponentEnum {
  globalFeed = 'globalFeed',
  communityFeed = 'communityFeed',
}

export const enum AmityPostComposerMode {
  CREATE = 'create',
  EDIT = 'edit',
}

export type AmityPostComposerPageType = {
  mode: AmityPostComposerMode;
  post?: Amity.Post;
  targetId?: string;
  targetType?: Amity.PostTargetType;
  community?: Amity.Community;
};

export interface AmityStoryTabComponentType {
  type: AmityStoryTabComponentEnum;
  targetId?: string;
}

export type TAmityStoryMediaType = (PhotoFile | VideoFile | undefined) & {
  uri: string;
  name: string;
};

export interface IAmityDraftStoryPage {
  targetId: string;
  targetType: Amity.StoryTargetType;
  mediaType: TAmityStoryMediaType;
  onCreateStory?: () => void;
  onDiscardStory?: () => void;
}
