import React from 'react';
import { Svg, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface StoryRingProps {
  colorOne?: string;
  colorTwo?: string;
  width?: number;
  height?: number;
}

const StoryRing: React.FC<StoryRingProps> = ({ colorOne = '#339AF9', colorTwo = '#78FA58', width = 64, height = 64 }) => (
  <Svg  width={width} height={height} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="31" stroke="url(#paint0_linear_2142_16601)" strokeWidth="2" />
    <Defs>
      <LinearGradient id="paint0_linear_2142_16601" x1="46.5" y1="2.5" x2="13.5" y2="61" gradientUnits="userSpaceOnUse">
        <Stop stopColor={colorOne} />
        <Stop offset="1" stopColor={colorTwo} />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default StoryRing;
