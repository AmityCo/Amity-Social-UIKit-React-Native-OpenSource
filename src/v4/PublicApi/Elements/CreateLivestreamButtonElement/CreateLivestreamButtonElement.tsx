import React from 'react';
import { ElementID, PageID, ComponentID } from '../../../enum';
import { useAmityElement, useConfigImageUri } from '../../../hook';
import ButtonWithIconElement from '../ButtonWithIconElement/ButtonWithIconElement';

interface CreateLivestreamButtonElementProps {
  pageId?: PageID;
  componentId?: ComponentID;
  onClick?: () => void;
}

const CreateLivestreamButtonElement = ({
  pageId = PageID.WildCardPage,
  componentId = ComponentID.WildCardComponent,
  onClick,
  ...props
}: CreateLivestreamButtonElementProps) => {
  const createStoryIcon = useConfigImageUri({
    configPath: {
      page: pageId,
      component: componentId,
      element: ElementID.create_livestream_button,
    },
    configKey: 'image',
  });

  const { config } = useAmityElement({
    pageId,
    componentId,
    elementId: ElementID.create_livestream_button,
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

export default React.memo(CreateLivestreamButtonElement);
