/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState, type FC } from 'react';
import { Client } from '@amityco/ts-sdk-react-native';
import type { AuthContextInterface } from '../types/auth.interface';
import { Alert, Platform } from 'react-native';
import type { IAmityUIkitProvider } from './amity-ui-kit-provider';
import { setupAmityVideoPlayer } from '@amityco/video-player-react-native';

export const AuthContext = React.createContext<AuthContextInterface>({
  client: {},
  isConnecting: false,
  error: '',
  login: () => {},
  logout: () => {},
  isConnected: false,
  sessionState: '',
  apiRegion: 'sg',
  authToken: '',
  fcmToken: undefined,
});

export const AuthContextProvider: FC<IAmityUIkitProvider> = ({
  userId,
  displayName,
  apiKey,
  apiRegion,
  apiEndpoint,
  children,
  authToken,
  fcmToken,
}: IAmityUIkitProvider) => {
  const [error, setError] = useState('');
  const [isConnecting, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionState, setSessionState] = useState('');
  const client: Amity.Client = Client.createClient(apiKey, apiRegion, {
    apiEndpoint: { http: apiEndpoint },
  });

  const sessionHandler: Amity.SessionHandler = {
    sessionWillRenewAccessToken(renewal) {
      renewal.renew();
    },
  };

  useEffect(() => {
    return Client.onSessionStateChange((state: Amity.SessionStates) =>
      setSessionState(state)
    );
  }, []);

  useEffect(() => {
    if (sessionState === 'established') {
      setIsConnected(true);
    }
  }, [sessionState]);

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const handleConnect = useCallback(async () => {
    let loginParam;

    loginParam = {
      userId: userId,
      displayName: displayName, // optional
    };
    if (authToken?.length > 0) {
      loginParam = { ...loginParam, authToken: authToken };
    }
    const response = await Client.login(loginParam, sessionHandler);
    if (!response) return;

    setupAmityVideoPlayer();

    if (fcmToken) {
      try {
        // await Client.registerPushNotification(fcmToken);
        // below is work around solution
        fetch(`${apiEndpoint}/v1/notification`, {
          method: 'POST',
          headers: {
            'X-API-KEY': apiKey,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            deviceId: generateUUID(),
            platform: Platform.OS,
            userId: userId,
            token: fcmToken,
          }),
        }).catch((err) => console.error(err));
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

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
      Client.stopUnreadSync();
      await Client.logout();
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
        sessionState,
        apiRegion: apiRegion.toLowerCase(),
      }}
    >
      {children}
    </AuthContext.Provider>
    //
  );
};
export default AuthContextProvider;
