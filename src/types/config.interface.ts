export interface IUIKitConfig {
  globalTheme: Record<string, any>;
  excludes: string[];
  getConfig: (id: string) => any;
}
