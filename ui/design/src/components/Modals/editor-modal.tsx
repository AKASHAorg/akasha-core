import * as React from 'react';
import { IEntryData } from '../Cards/entry-box';
import { EditorBox } from '../Editor/index';
import { StyledLayer } from './styled-modal';

export interface IEditorModal {
  className?: string;
  avatar?: string;
  ethAddress: string;
  closeModal: () => void;
  publishLabel: string;
  placeholderLabel: string;
  onPublish: any;
  embedEntryData?: IEntryData;
}

const EditorModal: React.FC<IEditorModal> = props => {
  const {
    closeModal,
    avatar,
    ethAddress,
    className,
    publishLabel,
    placeholderLabel,
    onPublish,
    embedEntryData,
  } = props;

  return (
    <StyledLayer onEsc={closeModal} onClickOutside={closeModal} modal={true} className={className}>
      <EditorBox
        ethAddress={ethAddress}
        publishLabel={publishLabel}
        placeholderLabel={placeholderLabel}
        onPublish={onPublish}
        avatar={avatar}
        embedEntryData={embedEntryData}
      />
    </StyledLayer>
  );
};

export default EditorModal;
