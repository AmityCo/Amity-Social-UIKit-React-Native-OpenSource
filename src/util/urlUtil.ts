import { StoryType } from '../v4/enum';
import { ALLOWED_MEDIA_TYPE } from '../constants';

export const checkURLValidation = (url: string) => {
  const pattern = new RegExp(
    '^([a-zA-Z]+:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', // fragment locator
    'i'
  );
  return pattern.test(url);
};

export const getMediaTypeFromUrl = (url: string) => {
  const fileExtension = url.split('.').pop()?.toLowerCase();
  if (ALLOWED_MEDIA_TYPE.image.includes(fileExtension)) return StoryType.image;
  if (ALLOWED_MEDIA_TYPE.video.includes(fileExtension)) return StoryType.video;
  return undefined;
};
