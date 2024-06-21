import React from 'react';
import { ElementID, PageID, ComponentID } from '../../../enum';
import { useAmityElement, useConfigImageUri } from '../../../hook';
import ButtonWithIconElement from '../ButtonWithIconElement/ButtonWithIconElement';

interface CreatePostButtonElementProps {
  pageId?: PageID;
  componentId?: ComponentID;
  onClick?: () => void;
}

const CreatePostButtonElement = ({
  pageId = PageID.WildCardPage,
  componentId = ComponentID.WildCardComponent,
  onClick,
  ...props
}: CreatePostButtonElementProps) => {
  const createPostIcon = useConfigImageUri({
    configPath: {
      page: pageId,
      component: componentId,
      element: ElementID.create_post_button,
    },
    configKey: 'image',
  });

  const { config } = useAmityElement({
    pageId,
    componentId,
    elementId: ElementID.create_post_button,
  });

  return (
    <ButtonWithIconElement
      label={(config as { text: string })?.text || ''}
      icon={createPostIcon}
      onClick={onClick}
      {...props}
    />
  );
};

export default CreatePostButtonElement;
