import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const LikedIcon = ({ color = '#1054DE', width = 16, height = 16 }) => (
  <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
    <Path
      d="M3.25 7H0.75C0.3125 7 0 7.34375 0 7.75V15.25C0 15.6875 0.3125 16 0.75 16H3.25C3.65625 16 4 15.6875 4 15.25V7.75C4 7.34375 3.65625 7 3.25 7ZM2 14.75C1.5625 14.75 1.25 14.4375 1.25 14C1.25 13.5938 1.5625 13.25 2 13.25C2.40625 13.25 2.75 13.5938 2.75 14C2.75 14.4375 2.40625 14.75 2 14.75ZM12 2.5625C12 0.25 10.5 0 9.75 0C9.09375 0 8.8125 1.25 8.6875 1.8125C8.5 2.5 8.34375 3.1875 7.875 3.65625C6.875 4.6875 6.34375 5.96875 5.09375 7.1875C5.03125 7.28125 5 7.375 5 7.46875V14.1562C5 14.3438 5.15625 14.5 5.34375 14.5312C5.84375 14.5312 6.5 14.8125 7 15.0312C8 15.4688 9.21875 16 10.7188 16H10.8125C12.1562 16 13.75 16 14.375 15.0938C14.6562 14.7188 14.7188 14.25 14.5625 13.6875C15.0938 13.1562 15.3438 12.1562 15.0938 11.3438C15.625 10.625 15.6875 9.59375 15.375 8.875C15.75 8.5 16 7.90625 15.9688 7.34375C15.9688 6.375 15.1562 5.5 14.125 5.5H10.9375C11.1875 4.625 12 3.875 12 2.5625Z"
      fill={color}
    />
  </Svg>
);
