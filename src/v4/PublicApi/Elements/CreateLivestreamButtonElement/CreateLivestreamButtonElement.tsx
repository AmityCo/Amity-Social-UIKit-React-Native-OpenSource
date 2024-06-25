import React from 'react';
import { ElementID, PageID, ComponentID } from '../../../enum';

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
}: CreateLivestreamButtonElementProps) => {
  return (
    <ButtonWithIconElement
      pageId={pageId}
      componentId={componentId}
      elementId={ElementID.create_livestream_button}
      onClick={onClick}
    />
  );
};

export default React.memo(CreateLivestreamButtonElement);
