import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const PostArrowIcon = ({ width = 8, height = 7, color = '#636878' }) => (
  <Svg width={width} height={height} viewBox="0 0 8 7">
    <Path
      d="M1.46094 6.33203C1.63281 6.33203 1.77344 6.26172 1.97656 6.16406L6.82422 3.82812C7.18359 3.65234 7.33594 3.45312 7.33594 3.18359C7.33594 2.91406 7.18359 2.71484 6.82422 2.53906L1.97656 0.203125C1.77344 0.105469 1.62891 0.0351562 1.45703 0.0351562C1.12109 0.0351562 0.863281 0.292969 0.863281 0.714844L0.867188 5.65625C0.867188 6.07422 1.125 6.33203 1.46094 6.33203Z"
      fill={color}
    />
  </Svg>
);

export default PostArrowIcon;