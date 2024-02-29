import React from 'react';
import { Svg, Rect, Path, SvgProps } from 'react-native-svg';

interface BlockOrUnblockIconProps extends SvgProps {
  color?: string;
}

const BlockOrUnblockIcon: React.FC<BlockOrUnblockIconProps> = ({
  color = '#292B32',
  width = 28,
  height = 28,
  style,
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 28 28" fill="none" style={style} {...props}>
    <Rect width={width} height={height} rx={4} fill="#EBECEF" />
    <Path d="M23.7812 20.3438C24 20.5 24.0625 20.8125 23.875 21.0312L23.2812 21.8125C23.0938 22.0312 22.7812 22.0625 22.5625 21.9062L4.1875 7.6875C3.96875 7.53125 3.9375 7.21875 4.09375 7L4.71875 6.21875C4.875 6 5.1875 5.9375 5.40625 6.125L10.0312 9.6875C10.1875 7.625 11.875 6 14 6C16.1875 6 18 7.8125 18 10C18 11.75 16.875 13.2188 15.3125 13.7812L23.7812 20.3438ZM7 19.2188C7 17.125 8.5 15.4375 10.4688 15.0938L19.4375 22H8.5C7.65625 22 7 21.3438 7 20.5V19.2188Z" fill={color} />
  </Svg>
);

export default BlockOrUnblockIcon;
