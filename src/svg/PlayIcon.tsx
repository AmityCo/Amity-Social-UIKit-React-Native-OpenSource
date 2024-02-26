import React from 'react';
import { Svg, Circle, Path, Defs, ClipPath, Rect, G } from 'react-native-svg';

const PlayIcon = ({ width = 40, height = 40 }) => (
  <Svg width={width} height={height} viewBox="0 0 40 40" fill="none">
    <G opacity="0.3">
      <Circle cx="20" cy="20" r="20" fill="black" />
      <Circle cx="20" cy="20" r="20" stroke="white" />
    </G>
    <G clipPath="url(#clip0)">
      <Path d="M16 13V27L27 20L16 13Z" fill="white" />
    </G>
    <Defs>
      <ClipPath id="clip0">
        <Rect width="24" height="24" fill="white" transform="translate(8 8)" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default PlayIcon;
