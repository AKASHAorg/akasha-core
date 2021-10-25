import React from 'react';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import EditorBox, { IEditorBox } from '../Editor';
import { Box, Text } from 'grommet';
import Icon from '../Icon';
import { isMobileOnly } from 'react-device-detect';

export interface IEditorCard extends IEditorBox {
  className?: string;
  titleLabel?: string;
  style?: React.CSSProperties;
  handleNavigateBack: () => void;
}

const EditorCard: React.FC<IEditorCard> = props => {
  const {
    className,
    avatar,
    ethAddress,
    postLabel,
    titleLabel,
    placeholderLabel,
    emojiPlaceholderLabel,
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
    uploadRequest,
    embedEntryData,
    editorState,
    setEditorState,
  } = props;

  const wrapperStyle = Object.assign(props.style, { height: isMobileOnly ? '100vh' : '' });

  return (
    <MainAreaCardBox className={className} style={wrapperStyle}>
      <Box direction="row" justify="between" pad="medium" align="center" flex={false}>
        <Icon
          type="arrowLeft"
          onClick={handleNavigateBack}
          clickable={true}
          primaryColor={true}
          size="xs"
        />
        <Text size="large">{titleLabel}</Text>
        <Icon type="akasha" clickable={true} style={{ marginLeft: '2rem' }} />
      </Box>
      <EditorBox
        avatar={avatar}
        ethAddress={ethAddress}
        disablePublish={disablePublish}
        onPublish={onPublish}
        postLabel={postLabel}
        withMeter={true}
        disablePublishLabel={disablePublishLabel}
        placeholderLabel={placeholderLabel}
        emojiPlaceholderLabel={emojiPlaceholderLabel}
        minHeight={'192px'}
        linkPreview={linkPreview}
        getLinkPreview={getLinkPreview}
        getMentions={getMentions}
        getTags={getTags}
        mentions={mentions}
        tags={tags}
        uploadRequest={uploadRequest}
        embedEntryData={embedEntryData}
        editorState={editorState}
        setEditorState={setEditorState}
      />
    </MainAreaCardBox>
  );
};

EditorCard.defaultProps = {
  titleLabel: 'New Post',
};

export default EditorCard;
