/* eslint-disable no-catch-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import {
  createClient,
  connectClient,
  disconnectClient,
  enableCache,
} from '@amityco/ts-sdk';
import type { AuthContextInterface } from '../types/auth.interface';
import { Alert } from 'react-native';
import type { IAmityUIkitProvider } from './amity-ui-kit-provider';

// const apiKey = 'b3babb0b3a89f4341d31dc1a01091edcd70f8de7b23d697f';

export const AuthContext = React.createContext<AuthContextInterface>({
  client: {},
  isConnecting: false,
  error: '',
  login: () => {},
  logout: () => {},
  isConnected: false,
});

export const AuthContextProvider: FC<IAmityUIkitProvider> = ({
  userId,
  displayName,
  apiKey,
  apiRegion,
  children,
}: IAmityUIkitProvider) => {
  const [error, setError] = useState('');
  const [isConnecting, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const client = createClient(apiKey, apiRegion);
  enableCache();

  const sessionHandler: Amity.SessionHandler = {
    sessionWillRenewAccessToken(renewal) {
      renewal.renew();
    },
  };

  const handleConnect = async () => {
    try {
      const res = await connectClient({ userId, displayName }, sessionHandler);
      console.log('res: ', res);
      setIsConnected(res);
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const login = async () => {
    setError('');
    setLoading(true);
    try {
      handleConnect();
    } catch (e) {
      const errorText =
        (e as Error)?.message ?? 'Error while handling request!';

      setError(errorText);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    login();
  }, [userId]);

  // TODO
  const logout = async () => {
    try {
      await disconnectClient();
    } catch (e) {
      const errorText =
        (e as Error)?.message ?? 'Error while handling request!';

      Alert.alert(errorText);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        error,
        isConnecting,
        login,
        client,
        logout,
        isConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
    //
  );
};
export default AuthContextProvider;
