import * as React from 'react';
import { Box, Text } from 'grommet';
import { isMobileOnly } from 'react-device-detect';

import Button from '../Button';
import { BasicCardBox } from '../EntryCard/basic-card-box';
import EditorCard, { IEditorCard } from '../EditorCard';
import { editorDefaultValue } from '../Editor/initialValue';
import { ModalContainer } from '../SignInModal/fullscreen-modal-container';

export interface IEditorModal extends Omit<IEditorCard, 'setEditorState'> {
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
    disablePublishLabel,
    disablePublish,
    onPublish,
    handleNavigateBack,
    linkPreview,
    getLinkPreview,
    getMentions,
    getTags,
    mentions,
    tags,
    titleLabel,
    uploadRequest,
    embedEntryData,
    editorState = editorDefaultValue,
  } = props;

  const [showCancel, setShowCancel] = React.useState(false);
  const [contentState, setContentState] = React.useState(editorState);

  const handleToggleShowCancel = () => {
    if (contentState === editorDefaultValue) {
      handleNavigateBack();
    } else {
      setShowCancel(!showCancel);
    }
  };

  const handleCloseModal = () => {
    setShowCancel(false);
    setContentState(editorDefaultValue);
    handleNavigateBack();
  };

  return (
    <ModalContainer>
      {!showCancel && (
        <EditorCard
          avatar={avatar}
          ethAddress={ethAddress}
          postLabel={postLabel}
          placeholderLabel={placeholderLabel}
          emojiPlaceholderLabel={emojiPlaceholderLabel}
          disablePublishLabel={disablePublishLabel}
          disablePublish={disablePublish}
          onPublish={onPublish}
          handleNavigateBack={handleToggleShowCancel}
          linkPreview={linkPreview}
          getLinkPreview={getLinkPreview}
          getMentions={getMentions}
          getTags={getTags}
          mentions={mentions}
          tags={tags}
          uploadRequest={uploadRequest}
          embedEntryData={embedEntryData}
          style={{ width: '36rem' }}
          editorState={contentState}
          setEditorState={setContentState}
          titleLabel={titleLabel}
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
