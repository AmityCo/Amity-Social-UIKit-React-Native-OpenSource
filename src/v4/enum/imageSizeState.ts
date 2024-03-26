export enum ImageSizeState {
  small = 'small',
  medium = 'medium',
  large = 'large',
  full = 'full',
}

export type ImageSizeSubset =
  | ImageSizeState.small
  | ImageSizeState.medium
  | ImageSizeState.large
  | ImageSizeState.full;
