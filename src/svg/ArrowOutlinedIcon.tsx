import React from 'react';
import { Svg, Path } from 'react-native-svg';

const ArrowOutlinedIcon = ({ width = 15, height = 15, color='#292B32' }) => (
  <Svg width={width} height={height} viewBox="0 0 10 17">
    <Path
      d="M1.34375 0.621094L0.640625 1.28906C0.5 1.46484 0.5 1.74609 0.640625 1.88672L7.00391 8.25L0.640625 14.6484C0.5 14.7891 0.5 15.0703 0.640625 15.2461L1.34375 15.9141C1.51953 16.0898 1.76562 16.0898 1.94141 15.9141L9.32422 8.56641C9.46484 8.39062 9.46484 8.14453 9.32422 7.96875L1.94141 0.621094C1.76562 0.445312 1.51953 0.445312 1.34375 0.621094Z"
      fill={color}
    />
  </Svg>
);

export default ArrowOutlinedIcon;