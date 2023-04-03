import * as React from 'react';

import AuthContextProvider from './auth-provider';

export interface IAmityUIkitProvider {
  userId: string;
  displayName: string;
  apiKey: string;
  apiRegion: string;
  children: any;
}
export default function AmityUiKitProvider({
  userId,
  displayName,
  apiKey,
  apiRegion,
  children,
}: IAmityUIkitProvider) {
  return (
    <AuthContextProvider
      userId={userId}
      displayName={displayName || userId}
      apiKey={apiKey}
      apiRegion={apiRegion}
    >
      {children}
    </AuthContextProvider>
  );
}
