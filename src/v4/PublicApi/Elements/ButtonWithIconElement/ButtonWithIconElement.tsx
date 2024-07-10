import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useStyle } from './styles';
import { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';
import { useAmityElement, useConfigImageUri } from '../../../hook';
import { PageID, ComponentID, ElementID } from '../../../enum';

interface ButtonWithIconElementProps {
  pageId: PageID;
  componentId: ComponentID;
  elementId: ElementID;
  configTheme?: MyMD3Theme;
  onClick?: () => void;
}

const ButtonWithIconElement = ({
  pageId,
  componentId,
  elementId,
  onClick,
}: ButtonWithIconElementProps) => {
  const icon = useConfigImageUri({
    configPath: {
      page: pageId,
      component: componentId,
      element: elementId,
    },
    configKey: 'image',
  });

  const { config, themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const styles = useStyle(themeStyles);

  return (
    <TouchableOpacity
      onPress={onClick}
      testID={accessibilityId}
      accessibilityLabel={accessibilityId}
    >
      <View style={styles.container}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.label}>{(config.text as string) || ''}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ButtonWithIconElement;
