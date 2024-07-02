import { PhotoFile, VideoFile } from 'react-native-vision-camera';

export const enum AmityStoryTabComponentEnum {
  globalFeed = 'globalFeed',
  communityFeed = 'communityFeed',
}

export const enum AmityPostComposerMode {
  CREATE = 'create',
  EDIT = 'edit',
}

export type AmityPostCreationOption = {
  mode?: AmityPostComposerMode.CREATE;
  targetId?: string;
  targetType?: Amity.PostTargetType;
  community?: Amity.Community;
};

export type AmityPostEditOption = {
  mode?: AmityPostComposerMode.EDIT;
  community?: Amity.Community;
  post?: Amity.Post;
};

export type AmityPostComposerPageType = {
  mode?: AmityPostComposerMode;
  targetId?: string;
  targetType?: Amity.PostTargetType;
  community?: Amity.Community;
  post?: Amity.Post;
};

// export type AmityPostComposerPageType = {
//   mode: AmityPostComposerMode;
//   targetId?: string;
//   targetType: Amity.PostTargetType;
//   community?: Amity.Community;
//   post?: Amity.Post;
// };

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
