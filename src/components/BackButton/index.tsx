import React from 'react';
import { TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SvgXml } from 'react-native-svg';
import { arrowBack } from '../../svg/svg-xml-list';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

interface IBackBtn {
  onPress?: () => any;
  goBack?: boolean;
}
export default function BackButton({ onPress, goBack = true }: IBackBtn) {
  const theme = useTheme() as MyMD3Theme;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <TouchableOpacity
      onPress={() => {
        if (goBack) {
          navigation.goBack();
        }

        onPress && onPress();
      }}
    >
      <SvgXml xml={arrowBack(theme.colors.base)} width={24} height={20} />
    </TouchableOpacity>
  );
}
