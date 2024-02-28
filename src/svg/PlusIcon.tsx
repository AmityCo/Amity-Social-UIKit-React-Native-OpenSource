import React from 'react';
import { Svg, Path, SvgProps } from 'react-native-svg';

interface PlusIconProps extends SvgProps {
  color?: string;
}

export const PlusIcon: React.FC<PlusIconProps> = ({
  color = "#292B32",
  width = 24,
  height = 24,
  style,
  ...rest
}: PlusIconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" style={style} {...rest}>
    <Path
      d="M18.1875 11.125H13.125V6.0625C13.125 5.78125 12.8438 5.5 12.5625 5.5H11.4375C11.1211 5.5 10.875 5.78125 10.875 6.0625V11.125H5.8125C5.49609 11.125 5.25 11.4062 5.25 11.6875V12.8125C5.25 13.1289 5.49609 13.375 5.8125 13.375H10.875V18.4375C10.875 18.7539 11.1211 19 11.4375 19H12.5625C12.8438 19 13.125 18.7539 13.125 18.4375V13.375H18.1875C18.4688 13.375 18.75 13.1289 18.75 12.8125V11.6875C18.75 11.4062 18.4688 11.125 18.1875 11.125Z"
      fill={color}
    />
  </Svg>
);
