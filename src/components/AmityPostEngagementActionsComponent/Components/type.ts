import { ComponentID, PageID } from '../../../enum';

export type AmityPostEngagementActionsSubComponentType = {
  community?: Amity.Community;
  postId: string;
  pageId?: PageID;
  componentId?: ComponentID;
};
