import { FileRepository, ContentFeedType } from '@amityco/ts-sdk-react-native';

import { Platform } from 'react-native';

export async function uploadFile(
  filePath: string,
  perCentCallback?: (percent: number) => void
): Promise<Amity.File<any>[]> {
  return await new Promise(async (resolve, reject) => {
    const formData = new FormData();
    const parts = filePath.split('/');
    const fileName = parts[parts.length - 1];
    const fileType = Platform.OS === 'ios' ? 'image/jpeg' : 'image/jpg';
    const uri =
      Platform.OS === 'android' ? filePath : filePath.replace('file://', '');

    formData.append('files', {
      name: fileName,
      type: fileType,
      uri: uri,
    });

    const { data: file } = await FileRepository.uploadFile(
      formData,
      (percent) => {
        perCentCallback && perCentCallback(percent);
      }
    );
    if (file) {
      resolve(file);
    } else {
      reject('Upload error');
    }
  });
}
async function base64ToBlob(base64: string): Promise<Blob> {
  const response = await fetch(base64);
  const blob = await response.blob();
  return blob;
}
// Convert the base64 string to a Blob

export async function uploadImageFile(
  filePath: string,
  perCentCallback?: (percent: number) => void,
  isBase64: boolean = false
): Promise<Amity.File<any>[]> {
  return await new Promise(async (resolve, reject) => {

    const formData = new FormData();
    if (isBase64 && Platform.OS !== 'ios' && Platform.OS !== 'android') {

      const imageBlob = await base64ToBlob(filePath);
      formData.append('files', imageBlob);
    } else {
      const parts = filePath.split('/');
      const fileName = parts[parts.length - 1];
      const fileType = Platform.OS === 'ios' ? 'image/jpeg' : 'image/jpg';
      const uri =
        Platform.OS === 'android' ? filePath : filePath.replace('file://', '');

      formData.append('files', {
        name: fileName,
        type: fileType,
        uri: uri,
      });
    }


    const { data: file } = await FileRepository.uploadImage(
      formData,
      (percent) => {
        perCentCallback && perCentCallback(percent);
      }
    );
    if (file) {
      resolve(file);
    } else {
      reject('Upload error');
    }
  });
}
export async function uploadVideoFile(
  filePath: string,
  perCentCallback?: (percent: number) => void
): Promise<Amity.File<any>[]> {
  return await new Promise(async (resolve, reject) => {
    const formData = new FormData();
    const parts = filePath.split('/');
    const fileName = parts[parts.length - 1];
    // const fileType = Platform.OS === 'ios' ? 'image/jpeg' : 'image/jpg';
    const uri =
      Platform.OS === 'android' ? filePath : filePath.replace('file://', '');

    formData.append('files', {
      name: fileName,
      type: 'video/*',
      uri: uri,
    });

    const { data: file } = await FileRepository.uploadVideo(
      formData,
      ContentFeedType.POST,
      (percent) => {
        perCentCallback && perCentCallback(percent);
      }
    );
    if (file) {
      resolve(file);
    } else {
      reject('Upload error');
    }
  });
}
export async function deleteAmityFile(
  fileId: string
): Promise<{ success: boolean }> {
  const reactionObject: Promise<{ success: boolean }> = new Promise(
    async (resolve, reject) => {
      try {
        const isFileDeleted = await FileRepository.deleteFile(fileId);
        resolve(isFileDeleted);
      } catch (error) {
        reject(error);
      }
    }
  );
  return reactionObject;
}
