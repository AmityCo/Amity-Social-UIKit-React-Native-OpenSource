import React from 'react';
import { Svg, Path } from 'react-native-svg';

const ArrowDownIcon = ({ color = '#292B32', width = 16, height = 10, style }: { color?: string, width?: number, height?: number, style?: any }) => (
  <Svg width={width} height={height} viewBox="0 0 16 10" fill="none" style={style}>
    <Path
      d="M15.6289 1.15625L14.9609 0.453125C14.7852 0.277344 14.5039 0.277344 14.3633 0.453125L8 6.81641L1.60156 0.453125C1.46094 0.277344 1.17969 0.277344 1.00391 0.453125L0.335938 1.15625C0.160156 1.29688 0.160156 1.57812 0.335938 1.75391L7.68359 9.10156C7.85938 9.27734 8.10547 9.27734 8.28125 9.10156L15.6289 1.75391C15.8047 1.57812 15.8047 1.29688 15.6289 1.15625Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownIcon;
