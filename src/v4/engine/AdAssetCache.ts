import AsyncStorage from '@react-native-async-storage/async-storage';

export type AdAsset = {
  fileUrl: string;
  downloadStatus: number;
  downloadId: number | null;
};

class AdAssetCache {
  static #instance: AdAssetCache;
  static #adAssetPrefix = 'amity.adAsset.';
  constructor() {}

  public static get instance(): AdAssetCache {
    if (!AdAssetCache.#instance) {
      AdAssetCache.#instance = new AdAssetCache();
    }

    return AdAssetCache.#instance;
  }

  private async getAllAdAssetKey(): Promise<string[]> {
    const allKeys = await AsyncStorage.getAllKeys();
    return allKeys.filter((key) => key.startsWith(AdAssetCache.#adAssetPrefix));
  }

  async getAllAdAssets(): Promise<AdAsset[]> {
    const adAssetKeys = await this.getAllAdAssetKey();
    const adAssets = await AsyncStorage.multiGet(adAssetKeys);
    return adAssets.map((adAsset) => JSON.parse(adAsset[1]));
  }

  async getAdAsset(fileUrl: string): Promise<AdAsset> {
    const adAssetKey = AdAssetCache.#adAssetPrefix + fileUrl;
    const adAsset = await AsyncStorage.getItem(adAssetKey);
    return JSON.parse(adAsset);
  }

  async insertAdAsset(adAsset: AdAsset): Promise<void> {
    const adAssetKey = AdAssetCache.#adAssetPrefix + adAsset.fileUrl;
    return AsyncStorage.setItem(adAssetKey, JSON.stringify(adAsset));
  }

  updateDownloadId(fileUrl: string, downloadId: number) {
    const adAssetKey = AdAssetCache.#adAssetPrefix + fileUrl;
    AsyncStorage.mergeItem(adAssetKey, JSON.stringify({ downloadId }));
  }

  updateDownloadStatus(fileUrl: string, status: number) {
    const adAssetKey = AdAssetCache.#adAssetPrefix + fileUrl;
    AsyncStorage.mergeItem(
      adAssetKey,
      JSON.stringify({ downloadStatus: status })
    );
  }

  deleteAdAsset(fileUrl: string) {
    const adAssetKey = AdAssetCache.#adAssetPrefix + fileUrl;
    AsyncStorage.removeItem(adAssetKey);
  }

  async deleteAll() {
    const adAssetKeys = await this.getAllAdAssetKey();
    AsyncStorage.multiRemove(adAssetKeys);
  }
}

export default AdAssetCache;
