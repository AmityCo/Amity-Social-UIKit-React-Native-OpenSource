import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Client as ASCClient,
  AdRepository,
} from '@amityco/ts-sdk-react-native';
import { TimeWindowTracker } from './TimeWindowTracker';
import AdAssetCache, { AdAsset } from './AdAssetCache';
import AssetDownloader, { DownloadStatus } from './AssetDownloader';
import { AdSupplier } from './AdSupplier';

class SeenRecencyCache {
  static #instance: SeenRecencyCache;
  #persistentCacheKey = 'amity.seenRecencyCache';

  constructor() {}

  public static get instance(): SeenRecencyCache {
    if (!SeenRecencyCache.#instance) {
      SeenRecencyCache.#instance = new SeenRecencyCache();
    }
    return SeenRecencyCache.#instance;
  }

  private async getSeenRecencyCache() {
    return JSON.parse(
      (await AsyncStorage.getItem(this.#persistentCacheKey)) || '{}'
    );
  }

  getSeenRecencyByAdId(adId?: string): number | void {
    if (!adId) return;
    return this.getSeenRecencyCache()[adId];
  }

  async setSeenRecencyCache(adId: string, value: number) {
    const seenRecencyCache = this.getSeenRecencyCache();
    seenRecencyCache[adId] = value;
    await AsyncStorage.setItem(
      this.#persistentCacheKey,
      JSON.stringify(seenRecencyCache)
    );
  }

  async clear() {
    await AsyncStorage.removeItem(this.#persistentCacheKey);
  }
}

export class AdEngine {
  static #instance: AdEngine;

  private isLoading = true;
  private ads: Amity.Ad[] = [];
  private settings: Amity.AdsSettings | null = null;

  private subscribers: Array<(networkAds: Amity.NetworkAds | null) => void> =
    [];

  private constructor() {
    ASCClient.onSessionStateChange(async (state: Amity.SessionStates) => {
      if (state === 'established') {
        await this.consumeNetworkAds();
      } else if (state === 'terminated') {
        this.clearAllCache();
      }
    });
  }

  public static get instance(): AdEngine {
    if (!AdEngine.#instance) {
      AdEngine.#instance = new AdEngine();
    }
    return AdEngine.#instance;
  }

  onNetworkAdsData(callback: (networkAds: Amity.NetworkAds | null) => void) {
    if (!this.isLoading && this.ads.length > 0 && this.settings) {
      callback({ ads: this.ads, settings: this.settings });
    }
    this.subscribers.push(callback);
  }

  private async clearAllCache() {
    this.ads = [];
    this.settings = null;

    const allAssets = await AdAssetCache.instance.getAllAdAssets();
    for (const asset of allAssets) {
      AssetDownloader.instance.deleteFile(asset.fileUrl);
    }

    AdAssetCache.instance.deleteAll();
    SeenRecencyCache.instance.clear();
    TimeWindowTracker.instance.clear();

    this.subscribers.forEach((subscriber) => subscriber(null));
  }

  private async consumeNetworkAds() {
    const networkAds = await AdRepository.getNetworkAds();

    this.ads = networkAds.ads;
    this.settings = networkAds.settings;

    await this.diffAssets(this.generateAssets(this.ads));
    await this.refreshDownloadStatuses();

    this.subscribers.forEach((subscriber) => subscriber(networkAds));
  }

  private generateAssets(ads: Amity.Ad[]): AdAsset[] {
    const assets = ads
      .flatMap(
        (ad) =>
          [ad?.image1_1?.fileUrl, ad?.image9_16?.fileUrl].filter(
            Boolean
          ) as string[]
      )
      .map((url) => ({
        fileUrl: url + '?size=large',
        downloadStatus: -1,
        downloadId: null,
      }));
    return assets;
  }

  private async diffAssets(newAsset: AdAsset[]) {
    const oldAssets = await AdAssetCache.instance.getAllAdAssets();

    const newAssetUrls = newAsset.map((asset) => asset.fileUrl);

    const assetToInsert = newAsset.filter(
      (asset) =>
        !oldAssets.some((oldAsset) => oldAsset.fileUrl === asset.fileUrl)
    );
    const assetToDelete = oldAssets.filter(
      (oldAsset) => !newAssetUrls.includes(oldAsset.fileUrl)
    );

    assetToDelete.forEach((asset) => {
      AdAssetCache.instance.deleteAdAsset(asset.fileUrl);
    });

    assetToInsert.forEach((asset) => {
      AdAssetCache.instance.insertAdAsset(asset);
    });
  }

  private async refreshDownloadStatuses() {
    const assets = await AdAssetCache.instance.getAllAdAssets();

    for (const asset of assets) {
      const fileExists = await AssetDownloader.instance.fileExists(
        asset.fileUrl
      );

      if (
        asset.downloadStatus === DownloadStatus.NOT_DOWNLOADED ||
        asset.downloadStatus === DownloadStatus.FAILED ||
        (asset.downloadStatus === DownloadStatus.COMPLETED && !fileExists)
      ) {
        try {
          const downloadId = await AssetDownloader.instance.enqueue(
            asset.fileUrl
          );

          AdAssetCache.instance.updateDownloadId(asset.fileUrl, downloadId);
          AdAssetCache.instance.updateDownloadStatus(
            asset.fileUrl,
            DownloadStatus.DOWNLOADING
          );

          // Listen to download status, to update the status when it changes
          AssetDownloader.instance.addStatusListener(
            asset.fileUrl,
            (status) => {
              AdAssetCache.instance.updateDownloadStatus(asset.fileUrl, status);
            }
          );
        } catch (e) {
          console.log('error: ', e);
        }
      } else if (asset.downloadStatus !== DownloadStatus.COMPLETED) {
        AdAssetCache.instance.updateDownloadStatus(
          asset.fileUrl,
          AssetDownloader.instance.getDownloadStatus(asset.downloadId)
        );
      }
    }
  }

  private getAdFrequency(placement: Amity.AdPlacement) {
    if (!this.settings) return null;
    switch (placement) {
      case 'feed':
        return this.settings.frequency.feed;
      case 'comment':
        return this.settings.frequency.comment;
      case 'story':
        return this.settings.frequency.story;
      default:
        return null;
    }
  }

  private getUrlByPlacement(ad: Amity.Ad, placement: Amity.AdPlacement) {
    if (!this.settings) return null;

    const suffix = '?size=large';

    if (placement === 'story') return ad.image9_16?.fileUrl + suffix;
    return ad.image1_1?.fileUrl + suffix;
  }

  getLastSeen(adId?: string) {
    return SeenRecencyCache.instance.getSeenRecencyByAdId(adId);
  }

  markClicked(ad: Amity.Ad, placement: Amity.AdPlacement) {
    ad.analytics.markLinkAsClicked(placement);
  }

  markSeen(ad: Amity.Ad, placement: Amity.AdPlacement) {
    // update recency seen time as now
    SeenRecencyCache.instance.setSeenRecencyCache(ad.adId, Date.now());
    if (this.getAdFrequency(placement)?.type === 'time-window') {
      TimeWindowTracker.instance.markSeen(placement);
    }
    ad.analytics.markAsSeen(placement);
  }

  getAdFrequencyByPlacement(placement: Amity.AdPlacement) {
    return this.getAdFrequency(placement);
  }

  async getRecommendedAds({
    placement,
    count,
    communityId,
  }: {
    placement: Amity.AdPlacement;
    count: number;
    communityId?: string;
  }) {
    const applicableAds = await this.getApplicableAds(placement, communityId);

    if (applicableAds.length === 0) {
      return [];
    } else {
      return AdSupplier.instance.recommendedAds({
        ads: applicableAds,
        count,
        placement,
        communityId,
      });
    }
  }

  private async getApplicableAds(
    placement: Amity.AdPlacement,
    communityId?: string
  ) {
    if (
      !this.settings?.enabled ||
      (this.getAdFrequencyByPlacement(placement).type === 'time-window' &&
        TimeWindowTracker.instance.hasReachedLimit(placement))
    )
      return [];

    // Filter for ready ads that match placement, not expired, and have downloaded assets
    const readyAds = this.ads.filter(async (ad) => {
      const url = this.getUrlByPlacement(ad, placement);
      return (
        ad.placements.includes(placement) &&
        (!ad.endAt || new Date(ad.endAt).getTime() > Date.now()) &&
        url &&
        (await AdAssetCache.instance.getAdAsset(url)).downloadStatus ===
          DownloadStatus.COMPLETED &&
        ad.advertiser?.advertiserId !== communityId // Exclude self-ads
      );
    });

    // Handle targeting logic
    let applicableAds: Amity.Ad[];

    if (communityId) {
      // First try to find ads targeted at this community
      const targetedAds = readyAds.filter((ad) =>
        ad.targets?.communityIds?.includes(communityId)
      );

      // If none found, fall back to non-targeted ads
      applicableAds =
        targetedAds.length > 0
          ? targetedAds
          : readyAds.filter((ad) => ad.targets?.communityIds?.length === 0);
    } else {
      // No community ID provided, only use non-targeted ads
      applicableAds = readyAds.filter(
        (ad) => !ad.targets || ad.targets?.communityIds.length === 0
      );
    }

    return applicableAds;
  }
}

export default AdEngine;
