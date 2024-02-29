import React from 'react';
import { Svg, Path, SvgProps } from 'react-native-svg';

interface UnfollowIconProps extends SvgProps {
  color?: string;
}

const UnfollowIcon: React.FC<UnfollowIconProps> = ({ color = '#292B32', width = 21, height = 16, ...props }) => (
  <Svg width={width} height={height} viewBox="0 0 21 16" fill="none" {...props}>
    <Path d="M18.4062 7.5L19.8438 6.09375C20.0312 5.90625 20.0312 5.5625 19.8438 5.375L19.125 4.65625C18.9375 4.46875 18.5938 4.46875 18.4062 4.65625L17 6.09375L15.5625 4.65625C15.375 4.46875 15.0312 4.46875 14.8438 4.65625L14.125 5.375C13.9375 5.5625 13.9375 5.90625 14.125 6.09375L15.5625 7.5L14.125 8.9375C13.9375 9.125 13.9375 9.46875 14.125 9.65625L14.8438 10.375C15.0312 10.5625 15.375 10.5625 15.5625 10.375L17 8.9375L18.4062 10.375C18.5938 10.5625 18.9375 10.5625 19.125 10.375L19.8438 9.65625C20.0312 9.46875 20.0312 9.125 19.8438 8.9375L18.4062 7.5ZM7 8C9.1875 8 11 6.21875 11 4C11 1.8125 9.1875 0 7 0C4.78125 0 3 1.8125 3 4C3 6.21875 4.78125 8 7 8ZM9.78125 9H9.25C8.5625 9.34375 7.8125 9.5 7 9.5C6.1875 9.5 5.40625 9.34375 4.71875 9H4.1875C1.875 9 0 10.9062 0 13.2188V14.5C0 15.3438 0.65625 16 1.5 16H12.5C13.3125 16 14 15.3438 14 14.5V13.2188C14 10.9062 12.0938 9 9.78125 9Z" fill={color} />
  </Svg>
);

export default UnfollowIcon;