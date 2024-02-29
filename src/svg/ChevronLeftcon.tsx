import React from 'react';
import { Svg, Path } from 'react-native-svg';

const ChevronLeftIcon = ({ width = 25, height = 24, color = '#292B32', style={} }) => (
  <Svg width={width} height={height} viewBox="0 0 25 24" fill="none" style={style}>
    <Path d="M8.84375 4.62109L8.14062 5.28906C8 5.46484 8 5.74609 8.14062 5.88672L14.5039 12.25L8.14062 18.6484C8 18.7891 8 19.0703 8.14062 19.2461L8.84375 19.9141C9.01953 20.0898 9.26562 20.0898 9.44141 19.9141L16.8242 12.5664C16.9648 12.3906 16.9648 12.1445 16.8242 11.9688L9.44141 4.62109C9.26562 4.44531 9.01953 4.44531 8.84375 4.62109Z" fill={color} />
  </Svg>
);

export default ChevronLeftIcon;
