import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { IBehaviour } from '../types/behaviour.interface';

const BehaviourContext = createContext<IBehaviour>(undefined);

interface IBehavioudProviderProps {
  children: ReactNode;
  behaviour: IBehaviour;
}

export const BehaviourProvider = ({
  children,
  behaviour,
}: IBehavioudProviderProps) => {
  const defaultBehaviour = useMemo(
    () => ({
      AmitySocialHomePageBehaviour: {},
      AmitySocialHomeTopNavigationComponentBehaviour: {},
      AmityCommunitySearchResultComponent: {},
      AmityEmptyNewsFeedComponent: {},
      AmityMyCommunitiesComponentBehaviour: {},
      AmityCreatePostMenuComponentBehavior: {},
    }),
    []
  );

  const customBehaviour = useMemo(
    () => ({
      ...defaultBehaviour,
      ...behaviour,
    }),
    [behaviour, defaultBehaviour]
  );

  return (
    <BehaviourContext.Provider value={customBehaviour}>
      {children}
    </BehaviourContext.Provider>
  );
};

export const useBehaviour = () => {
  const context = useContext(BehaviourContext);
  if (!context) {
    throw new Error('useBehaviour must be used within a BehaviourProvider');
  }
  return context;
};
