import * as React from 'react';
import { AmityUiKitProvider, AmityUiKitSocial } from '@amityco/asc-react-native-ui-kit';

export default function App() {

  const darkTheme = {
    primary: '#1054DE',      // Primary color for main elements
    secondary: '#636878',    // Secondary color UI elements e.g comment bubble, input bar 
    background: '#1E1E1E',   // Background color for the overall theme
    border: '#EBECEF',       // Border color for elements
    base: '#FFFFFF',         // Base color for main text, Title, input text 
    baseShade1: '#EBECEF',   // Base color for Sub Text, Sub Title, TimeStamp Text
    baseShade2: '#EBECEF',   // Base color for comments, like text
    baseShade3: '#EBECEF',   // Base color for placeHolder
    screenBackground: '#000000'
  };
  return (
    <AmityUiKitProvider
      apiKey="b3babb0b3a89f4341d31dc1a01091edcd70f8de7b23d697f"
      apiRegion="sg"
      userId="top"
      displayName="top"
      apiEndpoint="https://api.sg.amity.co"
      // theme={darkTheme}
      // darkMode
    >
      <AmityUiKitSocial />
    </AmityUiKitProvider>
  );
}
