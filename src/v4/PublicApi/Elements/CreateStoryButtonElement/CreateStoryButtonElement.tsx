import React from 'react';
import { ElementID, PageID, ComponentID } from '../../../enum';
import ButtonWithIconElement from '../ButtonWithIconElement/ButtonWithIconElement';

interface CreateStoryButtonElementProps {
  pageId?: PageID;
  componentId?: ComponentID;
  onClick?: () => void;
}

const CreateStoryButtonElement = ({
  pageId = PageID.WildCardPage,
  componentId = ComponentID.WildCardComponent,
  onClick,
}: CreateStoryButtonElementProps) => {
  return (
    <ButtonWithIconElement
      pageId={pageId}
      componentId={componentId}
      elementId={ElementID.create_story_button}
      onClick={onClick}
    />
  );
};

export default CreateStoryButtonElement;
