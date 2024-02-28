import React from 'react';
import { Svg, Path } from 'react-native-svg';

const PlayVideoIcon = ({ color = '#292B32', width = 25, height = 24, style }: { color?: string, width?: number, height?: number, style?: any }) => (
  <Svg width={width} height={height} viewBox="0 0 25 24" fill="none" style={style}>
    <Path
      d="M12.5 21C17.4706 21 21.5 16.9706 21.5 12C21.5 7.02944 17.4706 3 12.5 3C7.52944 3 3.5 7.02944 3.5 12C3.5 16.9706 7.52944 21 12.5 21Z"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
    />
    <Path
      d="M16.5 12L10.5 8V16L16.5 12Z"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PlayVideoIcon;
