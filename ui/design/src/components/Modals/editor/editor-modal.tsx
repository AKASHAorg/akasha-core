import { Box, Text } from 'grommet';
import * as React from 'react';
import { Button } from '../../Buttons';
import { BasicCardBox } from '../../Cards';
import EditorCard, { IEditorCard } from '../../Cards/editor-cards/editor-card';
import { editorDefaultValue } from '../../Editor';
import { ModalContainer } from '../common/fullscreen-modal-container';
import { ModalRenderer } from '../common/modal-renderer';

export interface IEditorModal extends Omit<IEditorCard, 'editorState' | 'setEditorState'> {
  slotId: string;
  showModal: boolean;
  // labels
  discardPostLabel?: string;
  discardPostInfoLabel?: string;
  keepEditingLabel?: string;
}

const EditorModal: React.FC<IEditorModal> = props => {
  const {
    slotId,
    showModal,
    ethAddress,
    avatar,
    postLabel,
    placeholderLabel,
    discardPostLabel,
    discardPostInfoLabel,
    keepEditingLabel,
    onPublish,
    handleNavigateBack,
    getMentions,
    getTags,
    mentions,
    tags,
    uploadRequest,
    embedEntryData,
  } = props;

  const [showCancel, setShowCancel] = React.useState(false);
  const [editorState, setEditorState] = React.useState(editorDefaultValue);

  const handleToggleShowCancel = () => {
    setShowCancel(!showCancel);
  };

  const handleCloseModal = () => {
    setShowCancel(false);
    setEditorState(editorDefaultValue);
    handleNavigateBack();
  };

  return (
    <ModalRenderer slotId={slotId}>
      {showModal && (
        <ModalContainer style={{ display: 'flex', justifyContent: 'center' }}>
          {!showCancel && (
            <EditorCard
              avatar={avatar}
              ethAddress={ethAddress}
              postLabel={postLabel}
              placeholderLabel={placeholderLabel}
              onPublish={onPublish}
              handleNavigateBack={handleToggleShowCancel}
              getMentions={getMentions}
              getTags={getTags}
              mentions={mentions}
              tags={tags}
              uploadRequest={uploadRequest}
              embedEntryData={embedEntryData}
              style={{ width: '36rem' }}
              editorState={editorState}
              setEditorState={setEditorState}
            />
          )}
          {showCancel && (
            <BasicCardBox>
              <Box pad="medium" align="center" gap="medium">
                <Text weight="bold">{`${discardPostLabel}?`}</Text>
                <Text color="secondaryText">{discardPostInfoLabel}</Text>
                <Box direction="row" gap="medium">
                  <Button onClick={handleCloseModal} label={discardPostLabel} />
                  <Button
                    onClick={handleToggleShowCancel}
                    primary={true}
                    label={keepEditingLabel}
                  />
                </Box>
              </Box>
            </BasicCardBox>
          )}
        </ModalContainer>
      )}
    </ModalRenderer>
  );
};

export default EditorModal;
