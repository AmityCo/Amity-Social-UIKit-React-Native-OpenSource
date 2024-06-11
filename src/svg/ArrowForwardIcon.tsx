import React from 'react';
import { Svg, Path } from 'react-native-svg';

const ArrowForwardIcon = ({ color = '#292B32', width = 5, height = 8, style }: { color?: string, width?: number, height?: number, style?: any }) => (
  <Svg width={width} height={height} viewBox="0 0 5 8" fill="none" style={style}>
    <Path
      d="M4.42188 4.21094L1 7.67969C0.882812 7.79688 0.695312 7.79688 0.601562 7.67969L0.132812 7.21094C0.015625 7.09375 0.015625 6.92969 0.132812 6.8125L2.89844 4L0.132812 1.21094C0.015625 1.09375 0.015625 0.90625 0.132812 0.8125L0.601562 0.34375C0.695312 0.226562 0.882812 0.226562 1 0.34375L4.42188 3.8125C4.53906 3.92969 4.53906 4.09375 4.42188 4.21094Z"
      fill={color}
    />
  </Svg>
);

export default ArrowForwardIcon;
