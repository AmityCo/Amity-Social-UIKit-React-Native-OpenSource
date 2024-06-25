import React from 'react';
import { ElementID, PageID, ComponentID } from '../../../enum';
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
}: CreatePostButtonElementProps) => {
  return (
    <ButtonWithIconElement
      pageId={pageId}
      componentId={componentId}
      elementId={ElementID.create_post_button}
      onClick={onClick}
    />
  );
};

export default CreatePostButtonElement;
