import React from 'react';
import { Svg, Path } from 'react-native-svg';

const ArrowBackIcon = ({ color = '#292B32', width = 10, height = 17, style }: { color?: string, width?: number, height?: number, style?: any }) => (
  <Svg width={width} height={height} viewBox="0 0 10 17" fill="none" style={style}>
    <Path
      id="Icon name"
      d="M8.62109 15.9141L9.32422 15.2461C9.46484 15.0703 9.46484 14.7891 9.32422 14.6484L2.96094 8.25L9.32422 1.88672C9.46484 1.74609 9.46484 1.46484 9.32422 1.28906L8.62109 0.621094C8.44531 0.445312 8.19922 0.445312 8.02344 0.621094L0.640625 7.96875C0.5 8.14453 0.5 8.39062 0.640625 8.56641L8.02344 15.9141C8.19922 16.0898 8.44531 16.0898 8.62109 15.9141Z"
      fill={color}
    />
  </Svg>
);

export default ArrowBackIcon;
