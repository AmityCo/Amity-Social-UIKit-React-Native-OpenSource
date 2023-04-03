import * as React from 'react';

import {
  multiply,
  AppNavigator,
  AmityUiKitProvider,
} from '@amityco/asc-react-native-ui-kit';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();
  console.log('result: ', result);

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  return (
    <AmityUiKitProvider
      apiKey="b3babb0b3a89f4341d31dc1a01091edcd70f8de7b23d697f"
      apiRegion="sg"
      userId="top"
      displayName="topAmity"
    >
      <AppNavigator />
    </AmityUiKitProvider>
  );
}
