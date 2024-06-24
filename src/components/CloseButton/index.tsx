import React from 'react';

import { TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { closeIcon } from '../../../src/svg/svg-xml-list';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export default function CloseButton({ onPress }: { onPress: () => void }) {
  const theme = useTheme() as MyMD3Theme;
  return (
    <TouchableOpacity onPress={onPress}>
      <SvgXml xml={closeIcon(theme.colors.baseShade2)} width={24} />
    </TouchableOpacity>
  );
}
