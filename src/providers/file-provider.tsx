import { runQuery, createQuery, createImage } from '@amityco/ts-sdk';

import { Platform } from 'react-native';

export async function uploadFile(filePath: string): Promise<string> {
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

    const query = createQuery(createImage, formData, (percent) =>
      console.log(percent + '%')
    );
    runQuery(query, (result) => {
      if (result.loading === false) {
        if (result.error === undefined) {
          console.log('Upload image success');
          return resolve((result.data[0] as Record<string, any>).fileId);
        } else {
          console.log('upload image error ' + JSON.stringify(result.error));
          return reject(new Error('Unable to create channel ' + result.error));
        }
      }
    });
  });
}
