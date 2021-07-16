import * as React from 'react';
import { Box, Text } from 'grommet';
import { isMobileOnly } from 'react-device-detect';

import Button from '../Button';
import { BasicCardBox } from '../EntryCard/basic-card-box';
import EditorCard, { IEditorCard } from '../EditorCard';
import { editorDefaultValue } from '../Editor/initialValue';
import { ModalContainer } from '../SignInModal/fullscreen-modal-container';

export interface IEditorModal extends Omit<IEditorCard, 'editorState' | 'setEditorState'> {
  // labels
  discardPostLabel?: string;
  discardPostInfoLabel?: string;
  keepEditingLabel?: string;
}

const EditorModal: React.FC<IEditorModal> = props => {
  const {
    ethAddress,
    avatar,
    postLabel,
    placeholderLabel,
    emojiPlaceholderLabel,
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
    if (editorState === editorDefaultValue) {
      handleNavigateBack();
    } else {
      setShowCancel(!showCancel);
    }
  };

  const handleCloseModal = () => {
    setShowCancel(false);
    setEditorState(editorDefaultValue);
    handleNavigateBack();
  };

  return (
    <ModalContainer style={{ display: 'flex', justifyContent: isMobileOnly ? 'start' : 'center' }}>
      {!showCancel && (
        <EditorCard
          avatar={avatar}
          ethAddress={ethAddress}
          postLabel={postLabel}
          placeholderLabel={placeholderLabel}
          emojiPlaceholderLabel={emojiPlaceholderLabel}
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
              <Button onClick={handleToggleShowCancel} primary={true} label={keepEditingLabel} />
            </Box>
          </Box>
        </BasicCardBox>
      )}
    </ModalContainer>
  );
};

export default EditorModal;
