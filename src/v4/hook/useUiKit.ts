import useConfig from './useConfig';
import { useGenerateThemeStyles } from './useGenerateThemeStyles';

export const useAmityElement = ({
  pageId,
  componentId,
  elementId,
}: {
  pageId: string;
  componentId: string;
  elementId: string;
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
  pageId: string;
  componentId: string;
}) => {
  const elementId = '*';
  return useAmityElement({ pageId, componentId, elementId });
};

export const useAmityPage = ({ pageId }: { pageId: string }) => {
  const componentId = '*';
  const elementId = '*';

  return useAmityElement({ pageId, componentId, elementId });
};
