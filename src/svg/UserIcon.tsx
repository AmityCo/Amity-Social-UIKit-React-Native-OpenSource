import React from 'react';
import { Svg, Rect, Path } from 'react-native-svg';

const UserIcon = ({ color = '#D9E5FC', width = 40, height = 40, style }: { color?: string, width?: number, height?: number, style?: any }) => (
  <Svg width={width} height={height} viewBox="0 0 40 40" fill="none" style={style}>
    <Rect width="40" height="40" rx="20" fill={color} />
    <Path
      d="M23.1255 13.1312C22.385 12.4069 21.3806 12 20.3333 12C19.2861 12 18.2817 12.4069 17.5412 13.1312C16.8006 13.8555 16.3846 14.8378 16.3846 15.8621C16.3846 16.8864 16.8006 17.8687 17.5412 18.593C18.2817 19.3172 19.2861 19.7241 20.3333 19.7241C21.3806 19.7241 22.385 19.3172 23.1255 18.593C23.866 17.8687 24.2821 16.8864 24.2821 15.8621C24.2821 14.8378 23.866 13.8555 23.1255 13.1312Z"
      fill="white"
    />
    <Path d="M20.3333 21.931C16.2831 21.931 13 23.7848 13 26.069V28H27.6667V26.069C27.6667 23.7848 24.3836 21.931 20.3333 21.931Z" fill="white" />
  </Svg>
);

export default UserIcon;
