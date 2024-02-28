import React from 'react';
import { Svg, Path } from 'react-native-svg';

const ExpandIcon = ({ color = '#636878', width = 16, height = 16, style }: { color?: string, width?: number, height?: number, style?: any }) => (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none" style={style}>
        <Path
            d="M13.824 9.72708L10.6334 12.8479C10.3988 13.0544 10.0469 13.0544 9.83578 12.8249L9.31965 12.3201C9.08504 12.1136 9.08504 11.7464 9.31965 11.5399L10.7507 10.2549H2.56305C2.2346 10.2549 2 10.0024 2 9.70413V5.56C2 5.25072 2.25072 5 2.56 5L3.31683 5C3.62611 5.00001 3.87683 5.25073 3.87683 5.56V8.4191H10.7507L9.31965 7.11113C9.08504 6.9046 9.08504 6.53745 9.31965 6.33093L9.83578 5.8261C10.0469 5.59663 10.3988 5.59663 10.6334 5.80315L13.824 8.92393C14.0587 9.1534 14.0587 9.49761 13.824 9.72708Z"
            fill={color}
        />
    </Svg>
);

export default ExpandIcon;
