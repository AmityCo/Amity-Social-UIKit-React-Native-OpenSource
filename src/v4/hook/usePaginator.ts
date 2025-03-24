import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AdEngine } from '../engine/AdEngine';
import {
  useAdSettings,
  useRecommendAds,
} from '../../v4/providers/AdEngineProvider';

export const usePaginatorCore = <T>({
  placement,
  pageSize,
  communityId,
  getItemId,
}: {
  placement: Amity.AdPlacement;
  pageSize: number;
  communityId?: string;
  getItemId: (item: T) => string;
}) => {
  const adSettings = useAdSettings();

  const [adsLoaded, setAdsLoaded] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [itemWithAds, setItemWithAds] = useState<Array<[T] | [T, Amity.Ad]>>(
    []
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const frequency = AdEngine.instance.getAdFrequencyByPlacement(placement);

  const count = (() => {
    if (frequency?.type === 'fixed') {
      return pageSize / frequency.value;
    }
    return 1;
  })();

  const recommendedAds = useRecommendAds({ count, placement, communityId });
  const recommendedAdsRef = useRef(recommendedAds);

  // Update ref and track when ads are loaded
  useEffect(() => {
    recommendedAdsRef.current = recommendedAds || [];

    // Mark as loaded when we have ads or explicitly know there are none
    if (recommendedAds !== undefined) {
      setAdsLoaded(true);
    }
  }, [recommendedAds]);

  // Internal function to process items once ads are loaded
  const _processCombineItems = (newItems: T[]): Array<T | Amity.Ad> => {
    if (!adSettings?.enabled) {
      return newItems;
    }
    if (frequency?.type === 'fixed') {
      const newItemIds = new Set(newItems.map((item) => getItemId(item)));

      const prevItemWithAds: Array<[T] | [T, Amity.Ad]> = itemWithAds
        .map((itemWithAd) => {
          const itemId = getItemId(itemWithAd[0]);

          if (!newItemIds.has(itemId)) {
            return null;
          }

          const updatedItem = newItems.find(
            (newItem) => getItemId(newItem) === itemId
          );

          if (updatedItem) {
            if (itemWithAd.length === 1) {
              return [updatedItem] as [T];
            }
            return [updatedItem, itemWithAd[1]] as [T, Amity.Ad];
          }

          return itemWithAd;
        })
        .filter((item) => item != null) as Array<[T] | [T, Amity.Ad]>;

      const startItem = prevItemWithAds[0];

      const topIndex = (() => {
        if (startItem) {
          const foundedIndex = newItems.findIndex(
            (newItem) => getItemId(newItem) === getItemId(startItem[0])
          );
          if (foundedIndex === -1) {
            return 0;
          }
          return foundedIndex;
        }
        return 0;
      })();

      const newestItems: Array<[T]> = (newItems || [])
        .slice(0, topIndex)
        .map((item) => [item]);

      const prevItems = [...newestItems, ...prevItemWithAds];

      const filteredNewItems = newItems.slice(topIndex).filter((newItem) => {
        const itemId = getItemId(newItem);
        return !prevItems.some((prevItem) => getItemId(prevItem[0]) === itemId);
      });

      let runningAdIndex = currentAdIndex;
      let runningIndex = currentIndex;

      const suffixItems: Array<[T] | [T, Amity.Ad]> = filteredNewItems.map(
        (newItem) => {
          runningIndex = runningIndex + 1; // 1
          const shouldPlaceAd = runningIndex % frequency.value === 0;

          if (!shouldPlaceAd) return [newItem];

          const ad = recommendedAdsRef.current[runningAdIndex];

          runningAdIndex =
            runningAdIndex + 1 > recommendedAdsRef.current.length - 1
              ? 0
              : runningAdIndex + 1;
          return [newItem, ad];
        }
      );

      setCurrentAdIndex(runningAdIndex);
      setCurrentIndex(runningIndex);

      const newItemsWithAds = [...prevItems, ...suffixItems];

      setItemWithAds(newItemsWithAds);
      if (newItemsWithAds.length === 0) {
        setCurrentAdIndex(0);
        setCurrentIndex(0);
      }

      const result = newItemsWithAds.flatMap((item) => item).filter(Boolean);
      return result;
    } else if (frequency?.type === 'time-window') {
      if (newItems.length === 0) {
        return newItems;
      }
      return [
        ...newItems.slice(0, 1),
        recommendedAds[0],
        ...newItems.slice(1),
      ].filter(Boolean);
    }
    return newItems;
  };

  const combineItemsWithAds = useCallback(
    (newItems: T[]): Array<T | Amity.Ad> => {
      if (!adsLoaded) {
        return newItems; // Return items without ads for now
      }

      return _processCombineItems(newItems);
    },
    [adsLoaded]
  );

  const reset = () => {
    setCurrentAdIndex(0);
    setAdsLoaded(false);
    setItemWithAds([]);
    setCurrentIndex(0);
  };

  return { combineItemsWithAds, reset, adsLoaded };
};

export const usePaginatorApi = <T>(params: {
  items: T[];
  placement: Amity.AdPlacement;
  pageSize: number;
  communityId?: string;
  getItemId: (item: T) => string;
}) => {
  const { items, ...rest } = params;
  const { combineItemsWithAds, reset } = usePaginatorCore(rest);

  const itemWithAds = useMemo(
    () => combineItemsWithAds(items),
    [combineItemsWithAds, items]
  );

  return { itemWithAds, reset };
};
