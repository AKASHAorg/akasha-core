import { Layer } from 'grommet';
import * as React from 'react';
import { IEntryData } from '../Cards/entry-box';
import { EditorBox } from '../Editor/index';

interface IEditorModal {
  className?: string;
  avatar?: string;
  ethAddress: string;
  closeModal: () => void;
  publishTitle: string;
  placeholderTitle: string;
  onPublish: any;
  embedEntryData?: IEntryData;
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
    embedEntryData,
  } = props;

  return (
    <Layer onEsc={closeModal} onClickOutside={closeModal} modal={true} className={className}>
      <EditorBox
        ethAddress={ethAddress}
        publishTitle={publishTitle}
        placeholderTitle={placeholderTitle}
        onPublish={onPublish}
        avatar={avatar}
        embedEntryData={embedEntryData}
      />
    </Layer>
  );
};

export default EditorModal;
