import { ComponentID, ElementID, PageID } from '../enum';
import useConfig from './useConfig';
import { useGenerateThemeStyles } from './useGenerateThemeStyles';

export const useAmityElement = ({
  pageId,
  componentId,
  elementId,
}: {
  pageId: PageID;
  componentId: ComponentID;
  elementId: ElementID;
}) => {
  const uiReference = `${pageId}/${componentId}/${elementId}`;
  const { excludes, getDefaultConfig, getUiKitConfig } = useConfig();
  const config = getUiKitConfig({
    page: pageId,
    component: componentId,
    element: elementId,
  });
  const defaultConfig = getDefaultConfig(uiReference);
  const themeStyles = useGenerateThemeStyles(config);
  const isExcluded = excludes.includes(uiReference);
  const accessibilityId = uiReference;

  return {
    config,
    defaultConfig,
    uiReference,
    accessibilityId,
    themeStyles,
    isExcluded,
  };
};

export const useAmityComponent = ({
  pageId,
  componentId,
}: {
  pageId: PageID;
  componentId: ComponentID;
}) => {
  const elementId = ElementID.WildCardElement;
  return useAmityElement({ pageId, componentId, elementId });
};

export const useAmityPage = ({ pageId }: { pageId: PageID }) => {
  const componentId = ComponentID.WildCardComponent;
  const elementId = ElementID.WildCardElement;

  return useAmityElement({ pageId, componentId, elementId });
};
