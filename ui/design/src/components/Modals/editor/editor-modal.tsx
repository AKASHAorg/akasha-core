import * as React from 'react';
import { StyledLayer } from '../common/styled-modal';

export interface IEditorModal {
  closeModal: () => void;
}

const EditorModal: React.FC<IEditorModal> = props => {
  const { closeModal } = props;

  return <StyledLayer onEsc={closeModal} onClickOutside={closeModal} modal={true}></StyledLayer>;
};

export default EditorModal;
