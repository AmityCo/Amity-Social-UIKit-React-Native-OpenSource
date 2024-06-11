import { Platform } from 'react-native';

import {
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';

const useRequestPermission = async ({
  onRequestPermissionFailed,
}: {
  onRequestPermissionFailed?: () => void;
}) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const {
    hasPermission: hasMicrophonePermission,
    requestPermission: requestMicrophonePermission,
  } = useMicrophonePermission();

  if (Platform.OS === 'android') return;

  const cameraPermissionResult =
    (!hasPermission && (await requestPermission())) ?? false;
  console.log('cameraPermissionResult', cameraPermissionResult);
  const microphonePermissionresult =
    !hasMicrophonePermission && (await requestMicrophonePermission());
  console.log('microphonePermissionresult', microphonePermissionresult);
  if (!cameraPermissionResult || !microphonePermissionresult) {
    onRequestPermissionFailed && onRequestPermissionFailed();
  }
};

export { useRequestPermission };
