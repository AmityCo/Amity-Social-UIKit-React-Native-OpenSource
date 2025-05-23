import React from 'react';
import { Svg, Path, SvgProps } from 'react-native-svg';

interface ReportIconProps extends SvgProps {
  color?: string;
}

const ReportIcon: React.FC<ReportIconProps> = ({ color = '#292B32', width = 16, height = 17, ...props }) => (
  <Svg width={width} height={height} viewBox="0 0 16 17" fill="none" {...props}>
    <Path d="M10.9062 4.09375C9.21875 4.09375 7.84375 3 5.75 3C4.96875 3 4.28125 3.15625 3.625 3.40625C3.6875 3.1875 3.71875 3 3.71875 2.78125C3.71875 2.71875 3.71875 2.6875 3.71875 2.65625C3.6875 1.78125 2.9375 1.0625 2.0625 1.03125C1.0625 0.96875 0.25 1.78125 0.25 2.75C0.25 3.375 0.53125 3.875 1 4.1875V16.25C1 16.6875 1.3125 17 1.75 17H2.25C2.65625 17 3 16.6875 3 16.25V13.3125C3.875 12.9375 4.96875 12.625 6.5625 12.625C8.25 12.625 9.625 13.7188 11.7188 13.7188C13.2188 13.7188 14.4375 13.1875 15.5625 12.4375C15.8125 12.25 16 11.9375 16 11.625V4C16 3.28125 15.2188 2.8125 14.5625 3.09375C13.5 3.59375 12.1875 4.09375 10.9062 4.09375Z" fill={color} />
  </Svg>
);

export default ReportIcon;
