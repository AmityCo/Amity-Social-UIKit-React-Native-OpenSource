export const getAvatarURL = (apiRegion: string, fileId: string) => {
  return `https://api.${apiRegion}.amity.co/api/v3/files/${fileId}/download?size=medium`;
};
