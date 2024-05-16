import { useCallback } from 'react';
import { CategoryRepository } from '@amityco/ts-sdk-react-native';

export const useCategory = () => {
  const getCategory = useCallback(
    async (categoryId: Amity.Category['categoryId']) => {
      const { data } = await CategoryRepository.getCategory(categoryId);
      return data;
    },
    []
  );

  return { getCategory };
};
