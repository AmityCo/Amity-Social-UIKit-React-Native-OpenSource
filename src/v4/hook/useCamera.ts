import {
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';

// Module-level variable to track if onRequestPermissionFailed has been called
let isFailedCalled = false;

const useRequestPermission = async ({
  onRequestPermissionFailed,
  shouldCall = true,
}: {
  onRequestPermissionFailed?: (callback?: () => void) => void;
  shouldCall?: boolean;
}) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const {
    hasPermission: hasMicrophonePermission,
    requestPermission: requestMicrophonePermission,
  } = useMicrophonePermission();

  if (!shouldCall) return;

  if (hasPermission && hasMicrophonePermission) return;

  let cameraPermissionGranted = hasPermission;
  let microphonePermissionGranted = hasMicrophonePermission;

  if (!hasPermission) {
    cameraPermissionGranted = await requestPermission();
  }

  if (!hasMicrophonePermission) {
    microphonePermissionGranted = await requestMicrophonePermission();
  }

  let permissionFailed = false;
  if (!cameraPermissionGranted || !microphonePermissionGranted) {
    permissionFailed = true;
  }

  // Check if permission failed and onRequestPermissionFailed has not been called yet
  if (permissionFailed && onRequestPermissionFailed && !isFailedCalled) {
    onRequestPermissionFailed(() => (isFailedCalled = false));
    isFailedCalled = true; // Prevent further calls
  }
};

export { useRequestPermission };
