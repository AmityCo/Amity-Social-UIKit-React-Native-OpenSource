import React from 'react';
import {
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text, useTheme } from 'react-native-paper';
import { useStyle } from './styles';
import { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

interface ButtonWithIconElementProps {
  label: string;
  icon: ImageSourcePropType;
  configTheme?: MyMD3Theme;
  onClick?: () => void;
}

const ButtonWithIconElement = ({
  label,
  icon,
  configTheme,
  onClick,
  ...props
}: ButtonWithIconElementProps) => {
  const theme = useTheme() as MyMD3Theme;
  const styles = useStyle(configTheme ?? theme);

  return (
    <TouchableOpacity onPress={onClick} {...props}>
      <View style={styles.container}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ButtonWithIconElement;
