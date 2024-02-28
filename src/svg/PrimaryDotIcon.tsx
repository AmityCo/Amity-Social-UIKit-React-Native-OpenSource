import React from 'react';
import { Svg, Circle } from 'react-native-svg';

const PrimaryDot = ({ color = '#1054DE', width = 6, height = 6, style }: { color?: string, width?: number, height?: number, style?: any }) => (
  <Svg width={width} height={height} viewBox="0 0 6 6" fill="none" style={style}>
    <Circle cx="3" cy="3" r="3" fill={color} />
  </Svg>
);

export default PrimaryDot;
