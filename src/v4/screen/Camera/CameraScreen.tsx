import {
  Alert,
  View,
  Pressable,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  useCameraDevice,
  Camera,
  PhotoFile,
  VideoFile,
  useCameraFormat,
} from 'react-native-vision-camera';
import { useStyles } from './styles';
import { useRequestPermission } from '../../hook/useCamera';
import { SvgXml } from 'react-native-svg';
import {
  closeIcon,
  flashOff,
  flashOn,
  storyGallery,
  switchCamera,
} from '../../../svg/svg-xml-list';
import ImagePicker, { launchImageLibrary } from 'react-native-image-picker';
import * as Progress from 'react-native-progress';
import { msToString } from '../../../util/timeUtil';
import { StoryType } from '../../enum';

enum ACTIVE_SWITCH {
  camera = 'camera',
  video = 'video',
}

const CameraScreen = ({ navigation, route }) => {
  const styles = useStyles();
  const communityData = route.params;
  useRequestPermission();
  const backCamera = useCameraDevice('back');
  const frontCamera = useCameraDevice('front');
  const cameraRef = useRef<Camera>(null);
  const timerRef = useRef<number | undefined | NodeJS.Timeout>(undefined);
  const [activeSwitch, setActiveSwitch] = useState<ACTIVE_SWITCH>(
    ACTIVE_SWITCH.camera
  );
  const isCamera = activeSwitch === ACTIVE_SWITCH.camera;
  const isVideo = activeSwitch === ACTIVE_SWITCH.video;
  const [flashOnState, setFlashOnState] = useState(false);
  const [activeCamera, setActiveCamera] = useState(backCamera);
  const [isRecording, setIsRecording] = useState(false);
  const format = Platform.select({
    ios: undefined,
    android: useCameraFormat(activeCamera, [
      { photoAspectRatio: 16 / 9 },
      { videoAspectRatio: 16 / 9 },
      { videoResolution: 'max' },
      { photoResolution: 'max' },
    ]),
  });
  const activeSwitchColor = { backgroundColor: '#ffffff' };
  const [totalTime, setTotalTime] = useState(0);
  const [timer, setTimer] = useState('');
  const TIMER_LIMIT = 60000;
  const timerBgColor = (isRecording || totalTime > 0) && {
    backgroundColor: '#FF305A',
  };

  const onStopRecord = useCallback(() => {
    setIsRecording(false);
    clearInterval(timerRef?.current);
    cameraRef?.current?.stopRecording();
  }, []);

  useEffect(() => {
    if (totalTime === TIMER_LIMIT) return onStopRecord();
    if (!isRecording) return clearInterval(timerRef?.current);
    timerRef.current = setInterval(
      () => setTotalTime((prev) => prev + 100),
      100
    );

    return () => clearInterval(timerRef?.current);
  }, [isRecording, onStopRecord, totalTime]);

  useEffect(() => {
    if (totalTime % 1000 === 0) {
      const timerString = msToString(totalTime);
      setTimer(timerString);
    }
  }, [totalTime]);

  const onPressCamera = useCallback(() => {
    setActiveSwitch(ACTIVE_SWITCH.camera);
  }, []);
  const onPressVideo = useCallback(() => {
    setActiveSwitch(ACTIVE_SWITCH.video);
  }, []);

  const onFinishCapture = useCallback(
    (cameraData: PhotoFile | VideoFile | undefined, type: StoryType) => {
      setTotalTime(0);
      if (!cameraData)
        return Alert.alert('Error', 'Error on camera, please try again');
      const name = cameraData.path.split('/').pop();
      const uri = Platform.select({
        ios: cameraData.path,
        android: `file://${cameraData.path}`,
      });
      const data = { ...cameraData, uri: uri, name: name };
      navigation.navigate('CameraPreview', {
        type: type,
        data: { ...data, ...communityData },
      });
    },
    [communityData, navigation]
  );

  const onPressCameraCapture = useCallback(async () => {
    const photo = await cameraRef?.current?.takePhoto({
      qualityPrioritization: 'speed',
      flash: flashOnState ? 'on' : 'off',
      enableShutterSound: false,
    });
    onFinishCapture(photo, StoryType.photo);
  }, [flashOnState, onFinishCapture]);

  const onStartRecord = useCallback(() => {
    setIsRecording(true);
    cameraRef?.current?.startRecording({
      onRecordingFinished: (video) => onFinishCapture(video, StoryType.video),
      onRecordingError: (error) =>
        Alert.alert('Video Record Error', error.message),
      fileType: 'mp4',
      flash: flashOnState ? 'on' : 'off',
    });
  }, [flashOnState, onFinishCapture]);

  const renderCaptureBtn = useCallback(() => {
    if (isCamera) {
      return (
        <Pressable
          style={styles.cameraCaptureBtn}
          onPress={onPressCameraCapture}
        >
          <View style={styles.cameraCaptureBtnFill} />
        </Pressable>
      );
    }
    return (
      <Pressable
        style={styles.videoCaptureBtn}
        onPressIn={onStartRecord}
        onPressOut={onStopRecord}
      >
        <View
          style={[
            styles.videoCaptureInnerButton,
            !isRecording && { width: 62, height: 62, borderRadius: 100 },
          ]}
        >
          <Progress.Circle
            size={75}
            progress={totalTime / TIMER_LIMIT}
            borderColor="transparent"
            color="red"
          />
        </View>
      </Pressable>
    );
  }, [
    isCamera,
    onPressCameraCapture,
    onStartRecord,
    onStopRecord,
    styles,
    totalTime,
    isRecording,
  ]);

  const onPressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPressFlash = useCallback(() => {
    setFlashOnState((prev) => !prev);
  }, []);

  const onPressSwitch = useCallback(() => {
    setActiveCamera((prev) => (prev === backCamera ? frontCamera : backCamera));
  }, [backCamera, frontCamera]);

  const onPressGallery = useCallback(async () => {
    const type = isCamera ? StoryType.photo : StoryType.video;
    const result: ImagePicker.ImagePickerResponse = await launchImageLibrary({
      mediaType: type,
      quality: 1,
      selectionLimit: 1,
    });
    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const data = { ...result.assets[0], path: result.assets[0].uri };
      if (data) {
        onFinishCapture(data as PhotoFile | VideoFile, type);
      } else {
        Alert.alert('Error on media selection');
      }
    }
  }, [isCamera, onFinishCapture]);

  if (!frontCamera && !backCamera) {
    Alert.alert('Camera Error', 'Cannot open camera', [
      {
        text: 'Go Back',
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
    return null;
  }

  if (!activeCamera) return null;

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          device={activeCamera}
          isActive={true}
          video={isVideo}
          photo={isCamera}
          audio={true}
          format={format}
        />

        {renderCaptureBtn()}
        {isVideo && (
          <View style={[styles.timer, timerBgColor]}>
            <Text style={styles.timerTxt}>{timer}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.backBtn} onPress={onPressBack}>
          <SvgXml xml={closeIcon('#fff')} width={10} height={10} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.flashIcon} onPress={onPressFlash}>
          <SvgXml
            xml={flashOnState ? flashOn() : flashOff()}
            width={24}
            height={24}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.switchCamera} onPress={onPressSwitch}>
          <SvgXml xml={switchCamera()} width={32} height={32} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.gallery} onPress={onPressGallery}>
          <SvgXml xml={storyGallery()} width={32} height={32} />
        </TouchableOpacity>
      </View>
      <View style={styles.switchContainer}>
        <Pressable
          style={[styles.switch, isCamera && activeSwitchColor]}
          onPress={onPressCamera}
        >
          <Text style={styles.switchTxt}>Photo</Text>
        </Pressable>
        <Pressable
          style={[styles.switch, isVideo && activeSwitchColor]}
          onPress={onPressVideo}
        >
          <Text style={styles.switchTxt}>Video</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default CameraScreen;
