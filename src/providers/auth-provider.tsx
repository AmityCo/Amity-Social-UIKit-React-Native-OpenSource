/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState, type FC } from 'react';
import { Client } from '@amityco/ts-sdk-react-native';
import type { AuthContextInterface } from '../types/auth.interface';
import { Alert, Platform, Clipboard } from 'react-native';
import type { IAmityUIkitProvider } from './amity-ui-kit-provider';

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
    if (response && fcmToken) {
      fetch(`${apiEndpoint}/api/v3/notification/setting?level=user`, {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkQ4cVQzRHA5dlNvX0w5d2l4YmF1QlFkNHFLbk5neFhqWHJHakhlTGxVaDAifQ.eyJ1c2VyIjp7InVzZXJJZCI6IjY1YThiNTJlN2FlODYwNDhkZGM0OGY0ZSIsInB1YmxpY1VzZXJJZCI6IlJOLU5haW5nLTEiLCJkZXZpY2VJbmZvIjp7ImtpbmQiOiJ3ZWIiLCJtb2RlbCI6InJlYWN0bmF0aXZlI3Vua25vd25fYWdlbnQiLCJzZGtWZXJzaW9uIjoidjYuMjUuMS1janMifSwibmV0d29ya0lkIjoiNjMxZjE2YmUxZTQ0MDQwMGRhNTY2M2IwIiwiZGlzcGxheU5hbWUiOiJSTi1OYWluZy0xIiwicmVmcmVzaFRva2VuIjoiZWY5ZjhiOWE1OGY3MzAyM2EyZTgyZDU2MGZmYThmNTc3YjAwNTViNmM0NDRmNWRhNjNiODdiODc2MmE4OTU4ZjM1YTY2NTY4MWI2YTY1MWMifSwic3ViIjoiNjVhOGI1MmU3YWU4NjA0OGRkYzQ4ZjRlIiwiaXNzIjoiaHR0cHM6Ly9hcGkuc3RhZ2luZy5hbWl0eS5jbyIsImlhdCI6MTcxNzU4MDkwMiwiZXhwIjoxNzIwMTcyOTAyfQ.VAhxXI8N3zfmVNx1CG1Aac-LiCjklaMN8RxJIpztjowWLjqMgRVfhll4X7oen6DThcZmWslUM87JPSm6tAlHi1YKZFReICyB0fzhnQstdagxD-s3qlbUFD1UtjswXJdgL9fWFq9EgZSXbSpxdwP05HNoYrV5HosXenuvzwhZSwCZAkHL2zDt1-nRal4nbJlH9oXHbcuQWADe3CFnXSLAQIj_PeuorC3KdJasOJDMBfpRJgErzFtVkmC4fjFYNFAhG4XR3pES8YdFFB9OjS6uEEbh3OBIg0Gp6kIO9lChE9KDspTWdA8_YHKGUKQvG2pIUyhiGs4tI1Dqumw2gyWsPA',
          Accept: 'application/json',
        },
      })
        .then(async (res) => console.log(await res.text()))
        .catch((er) => console.log(er));

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
        })
          .then(async (res) => {
            if ((await JSON.parse(await res.text()).status) === 'success') {
              Alert.alert('Register Token Success', fcmToken, [
                { text: 'Copy', onPress: () => Clipboard.setString(fcmToken) },
              ]);
            }
          })
          .catch((error) => console.error(error));
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
    if (fcmToken) {
      login();
    }
  }, [userId, fcmToken]);

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
