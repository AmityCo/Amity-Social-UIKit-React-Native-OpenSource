export enum TabName {
  NewsFeed = 'NewsFeed',
  Explorer = 'Explorer',
  Timeline = 'Timeline',
  Gallery = 'Gallery',
  Communities = 'Communities',
  Accounts = 'Accounts',
}

export type TabNameSubset =
  | TabName.Accounts
  | TabName.Communities
  | TabName.Explorer
  | TabName.Gallery
  | TabName.NewsFeed
  | TabName.Timeline;
