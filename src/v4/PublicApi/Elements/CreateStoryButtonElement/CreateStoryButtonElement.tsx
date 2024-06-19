import React from 'react';
import { ElementID, PageID, ComponentID } from '../../../enum';
import { useAmityElement, useConfigImageUri } from '../../../hook';
import ButtonWithIconElement from '../ButtonWithIconElement/ButtonWithIconElement';

interface CreateStoryButtonElementProps {
  pageId?: PageID | '*';
  componentId?: ComponentID | '*';
  onClick?: () => void;
}

const CreateStoryButtonElement = ({
  pageId = '*',
  componentId = '*',
  onClick,
  ...props
}: CreateStoryButtonElementProps) => {
  const createStoryIcon = useConfigImageUri({
    configPath: {
      page: pageId,
      component: componentId,
      element: ElementID.create_story_button,
    },
    configKey: 'image',
  });

  const { config } = useAmityElement({
    pageId,
    componentId,
    elementId: ElementID.create_story_button,
  });

  return (
    <ButtonWithIconElement
      label={(config as { text: string })?.text || ''}
      icon={createStoryIcon}
      onClick={onClick}
      {...props}
    />
  );
};

export default CreateStoryButtonElement;
