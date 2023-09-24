export type AuthContextInterface = {
  error: string;
  isConnecting: boolean;
  logout: () => void;
  client?: Amity.Client | {};
  login: () => void;
  isConnected: boolean;
  sessionState: string;
  apiRegion: string;
};
