

export const enum AmityStoryTabComponentEnum {
  globalFeed = 'globalFeed',
  communityFeed = 'communityFeed',
}

export const enum AmityPostComposerMode {
  CREATE = 'create',
  EDIT = 'edit',
}

export enum mediaAttachment {
  image = 'image',
  video = 'video',
  file = 'file',
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



export interface IDisplayImage {
    url: string;
    fileId: string | undefined;
    fileName: string;
    isUploaded: boolean;
    thumbNail?: string;
    postId?: string;
  }
  