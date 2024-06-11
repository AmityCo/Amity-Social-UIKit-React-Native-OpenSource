import { Linking } from 'react-native';
import {
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';

const useRequestPermission = async () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const {
    hasPermission: hasMicrophonePermission,
    requestPermission: requestMicrophonePermission,
  } = useMicrophonePermission();

  const cameraPermissionResult = !hasPermission && (await requestPermission());
  const microphonePermissionresult =
    !hasMicrophonePermission && (await requestMicrophonePermission());
  !cameraPermissionResult ||
    (!microphonePermissionresult && (await Linking.openSettings()));
  return;
};

export { useRequestPermission };
