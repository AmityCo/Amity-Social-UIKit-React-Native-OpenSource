import React from 'react';
import { ElementID, PageID, ComponentID } from '../../../enum';
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
}: CreatePollButtonElementProps) => {
  return (
    <ButtonWithIconElement
      pageId={pageId}
      componentId={componentId}
      elementId={ElementID.create_poll_button}
      onClick={onClick}
    />
  );
};

export default CreatePollButtonElement;
