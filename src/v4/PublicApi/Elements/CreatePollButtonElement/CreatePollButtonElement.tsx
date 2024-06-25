import React from 'react';
import { ElementID, PageID, ComponentID } from '../../../enum';
import { useAmityElement, useConfigImageUri } from '../../../hook';
import ButtonWithIconElement from '../ButtonWithIconElement/ButtonWithIconElement';

interface CreatePollButtonElementProps {
  pageId?: PageID;
  componentId?: ComponentID;
  onClick?: () => void;
}

const CreatePollButtonElement = ({
  pageId = PageID.WildCardPage,
  componentId = ComponentID.WildCardComponent,
  onClick,
  ...props
}: CreatePollButtonElementProps) => {
  const createPollIcon = useConfigImageUri({
    configPath: {
      page: pageId,
      component: componentId,
      element: ElementID.create_poll_button,
    },
    configKey: 'image',
  });

  const { config } = useAmityElement({
    pageId,
    componentId,
    elementId: ElementID.create_poll_button,
  });

  return (
    <ButtonWithIconElement
      label={(config as { text: string })?.text || ''}
      icon={createPollIcon}
      onClick={onClick}
      {...props}
    />
  );
};

export default CreatePollButtonElement;
