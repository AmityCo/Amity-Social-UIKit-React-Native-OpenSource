import React from 'react';
import { Svg, Path } from 'react-native-svg';

const ReplyIcon = ({ color = '#898E9E', width = 19, height = 18, style }: { color?: string, width?: number, height?: number, style?: any }) => (
  <Svg width={width} height={height} viewBox="0 0 19 18" fill="none" style={style}>
    <Path
      d="M17.625 6.96875L12.125 1.46875C11.1875 0.5 9.59375 1.1875 9.59375 2.53125V5.03125C5.28125 5.15625 0.09375 6 0.09375 11.3438C0.09375 13.625 1.28125 15.5312 3.125 16.75C4.28125 17.5312 5.8125 16.4375 5.375 15.0625C4.625 12.625 5 11.3438 9.59375 11.0625V13.5C9.59375 14.8438 11.1875 15.5312 12.125 14.5625L17.625 9.0625C18.2188 8.5 18.2188 7.53125 17.625 6.96875ZM11.0938 13.5V9.53125C5.9375 9.5625 2.40625 10.5625 3.96875 15.5C2.84375 14.75 1.59375 13.4375 1.59375 11.3438C1.59375 6.875 6.59375 6.53125 11.0938 6.53125V2.5L16.5938 8L11.0938 13.5Z"
      fill={color}
    />
  </Svg>
);

export default ReplyIcon;
