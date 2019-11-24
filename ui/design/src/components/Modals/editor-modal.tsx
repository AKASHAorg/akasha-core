import { Layer } from 'grommet';
import * as React from 'react';
import { EditorBox } from '../Editor/index';

interface IEditorModal {
  className?: string;
  avatar?: string;
  ethAddress: string;
  closeModal: () => void;
  publishTitle: string;
  placeholderTitle: string;
  onPublish: any;
}

const EditorModal: React.FC<IEditorModal> = props => {
  const {
    closeModal,
    avatar,
    ethAddress,
    className,
    publishTitle,
    placeholderTitle,
    onPublish,
  } = props;

  return (
    <Layer onEsc={closeModal} onClickOutside={closeModal} modal={true} className={className}>
      <EditorBox
        ethAddress={ethAddress}
        publishTitle={publishTitle}
        placeholderTitle={placeholderTitle}
        onPublish={onPublish}
        avatar={avatar}
      />
    </Layer>
  );
};

export default EditorModal;
